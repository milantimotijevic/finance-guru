const axios = require('axios');
const Boom = require('@hapi/boom');
const Logger = require('../util/Logger');

const { BASIQ_HOSTNAME, BASIQ_API_KEY } = process.env;

let accessTokenWrapper;

// fetch access_token from Basiq API
async function fetchToken() {
    try {
        const data = new URLSearchParams();
        data.append('scope', 'SERVER_ACCESS');
    
        const response = await axios.post(
            `${BASIQ_HOSTNAME}/token`,
            data,
            {
                headers: {
                    'Authorization': `Basic ${BASIQ_API_KEY}`,
                    'basiq-version': 2.1,
                },
            }
        );
    
        return response.data;
    } catch (err) {
        Logger.error(`Failed to fetch Basiq API access_token. Error: ${err}`);
        throw new Boom.internal('Error authenticating with Basiq server');
    } 
}

// check for valid Basiq access_token in memory and fetch a new one if needed
async function getToken() {
    const now = new Date();
    // set 2 minutes buffer just in case
    now.setMinutes(now.getMinutes() + 2);

    // check if valid token is already in memory
    if (!accessTokenWrapper || !accessTokenWrapper.expires || (now > accessTokenWrapper.expires)) {
        // valid token not found, fetching from BasiqAPI and storing for future use
        const tokenResponse = await fetchToken();
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + tokenResponse.expires_in);

        // store in memory for future use
        accessTokenWrapper = {
            accessToken: tokenResponse.access_token,
            expires,
        };
        Logger.info('Fetched new access_token');
    }

    return accessTokenWrapper.accessToken;
}

// wrapper for sending requests that require "access_token"
async function sendAuthenticated(method, url, data) {
    const access_token = await getToken();
    try {
        const result = await axios({
            method,
            url,
            data,
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        });

        return result.data;
    } catch (err) {
        // Basiq's http error format
        if (err.response && err.response.data && err.response.data.data) {
            throw new Boom.badData(err.response.data.data[0].detail);
        } else {
            throw new Boom.badGateway('Failed to connect to Basiq server');
        }
    }   
}

// url can either be "bare" or contain a pagination pointer in query param
async function getTransactionBatch(url) {
    Logger.info(`Fetching transactions batch from ${url}`);

    const transactionBatch = await sendAuthenticated('get', url);

    return {
        batch: transactionBatch ? transactionBatch.data : [],
        nextBatchUrl: transactionBatch && transactionBatch.links ? transactionBatch.links.next : undefined,
    };
};

const getTransactions = async (userId) => {
    let transactions = [];
    let batchUrl = `${BASIQ_HOSTNAME}/users/${userId}/transactions`;

    // track how many times a single batch fetch has been retried
    let retries = 0;
    // keep fetching until we no longer have "batchUrl" for the next batch
    while (batchUrl) {
        try {
            const { batch, nextBatchUrl } = await getTransactionBatch(batchUrl);
            if (batch.length > 0) {
                transactions = transactions.concat(batch);
            }

            // batch successfully fetched, prepare for next one
            batchUrl = nextBatchUrl;
            retries = 0;
        } catch (err) {
            if (err.output && err.output.statusCode
            && (err.output.statusCode >= 400 || err.output.statusCode < 500)) {
                // the error is within the 4xx range, rethrow immediately
                Logger.error(`Failed to fetch transaction batch due to a 4xx error. Error: ${err}`);
                throw err;
            }
            // it might be a "temporary" error, let's consider retrying
            if (retries > 3) {
                // batch fetch limit exceeded, fail the entire process
                Logger.error(`Failed to fetch a batch from ${batchUrl}, retries limit exceeded at ${retries}. Error: ${err}`);
                throw err;
            } else {
                // fail limit not yet exceeded, increment the counter and retry this specific batch
                Logger.warn(`Failed to fetch a batch from ${batchUrl}, retries so far: ${retries}. Error: ${err}`);
                retries++;
            }
        }
    }

    // all batches complete
    return transactions;
};

// instruct BasiqAPI to fetch the latest transaction data for this user
const refreshConnections = async (userId) => {
    const refreshResult = await sendAuthenticated(
        'post',
        `${BASIQ_HOSTNAME}/users/${userId}/connections/refresh`,
        null,
    );

    return refreshResult;
};

const getUsers = async () => {
    const users = await sendAuthenticated('get', `${BASIQ_HOSTNAME}/users`);

    return users.data;
};

const createUser = async (userParam) => {
    const user = await sendAuthenticated('post', `${BASIQ_HOSTNAME}/users`, userParam);

    return user;
};

const connectInstitution = async (userId, institutionParams) => {
    const connectionResponse = await sendAuthenticated(
        'post',
        `${BASIQ_HOSTNAME}/users/${userId}/connections`,
        {
            loginId: institutionParams.loginId,
            password: institutionParams.password,
            institution: {
                id: institutionParams.id,
            }
        },
    );

    return connectionResponse;
};

const deleteUser = async (userId) => {
    const deletionResult = await sendAuthenticated('delete', `${BASIQ_HOSTNAME}/users/${userId}`);

    return deletionResult;
};

// hit base endpoint and confirm status is 200
const getHealthCheck = async () => {
    let state;

    try {
        const response = await axios.get(
            `${BASIQ_HOSTNAME}`,
        );

        if (response.status === 200) {
            state = 'up';
        } else {
            state = 'down';
        }

    } catch (err) {
        state = 'down';
    }

    return state;
};

module.exports = {
    getTransactions,
    refreshConnections,
    getUsers,
    createUser,
    connectInstitution,
    deleteUser,
    getHealthCheck,
};