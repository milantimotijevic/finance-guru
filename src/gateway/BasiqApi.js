const axios = require('axios');
const Boom = require('@hapi/boom');
const Logger = require('../util/Logger');

const { BASIQ_HOSTNAME, BASIQ_API_KEY } = process.env;

let accessTokenWrapper;

async function fetchToken() {
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
}

async function getToken() {
    const oneHourAgo = new Date();
    // roughly one hour ago
    oneHourAgo.setMinutes(oneHourAgo.getMinutes() - 58);

    // check if valid token is already in memory
    if (!accessTokenWrapper || !accessTokenWrapper.expires || (oneHourAgo > accessTokenWrapper.expires)) {
        // valid token not found, fetching from BasiqAPI and storing for future use
        const tokenResponse = await fetchToken();
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() - tokenResponse.expires);
        accessTokenWrapper = {
            accessToken: tokenResponse.access_token,
            expires,
        };
        Logger.info('Fetched new access_token');
    }

    return accessTokenWrapper.accessToken;
}

// url can either be "bare" or contain a pagination pointer in query param
async function getTransactionsBatch (url) {
    const access_token = await getToken();
    Logger.info(`Fetching transactions batch from ${url}`);
    const response = await axios.get(
        url,
        {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        }
    );

    return {
        batch: response.data ? response.data.data : [],
        nextBatchUrl: response.data && response.data.links ? response.data.links.next : undefined,
    };
};

async function getTransactions (userId) {
    let transactions = [];
    let batchUrl = `${BASIQ_HOSTNAME}/users/${userId}/transactions`;

    // track how many times a single batch fetch has been retried
    let retries = 0;
    // keep fetching until we no longer have "batchUrl" for the next batch
    while (batchUrl) {
        try {
            const { batch, nextBatchUrl } = await getTransactionsBatch(batchUrl);
            if (batch.length > 0) {
                transactions = transactions.concat(batch);
            }

            // batch successfully fetched, prepare for next one
            batchUrl = nextBatchUrl;
            retries = 0;
        } catch (err) {
            if (retries > 3) {
                // batch fetch limit exceeded, fail the entire process
                Logger.error(`Failed to fetch a batch from ${batchUrl}, retries limit exceeded at ${retries}. Error: ${err}`);
                throw new Boom.internal('Unable to communicate with BasiqAPI');
            } else {
                // fail limit not exceeded yet, increment the counter and retry this specific batch
                Logger.warn(`Failed to fetch a batch from ${batchUrl}, retries so far: ${retries}. Error: ${err}`);
                retries++;
            }
        }
    }

    // all batches complete
    return transactions;
};

// hit base endpoint and confirm status is 200
const getHealthCheck = async () => {
    let state;

    try {
        const response = await axios.get(
            `${BASIQ_HOSTNAME}`,
            {
                headers: {
                    'Authorization': `Basic ${BASIQ_API_KEY}`,
                    'basiq-version': 2.1,
                },
            }
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

// poll BasiqAPI until job completion confirmation is received
async function awaitJobCompletion(jobId) {
    let retries = 0;

    try {

    } catch (err) {

    }
}

// instruct BasiqAPI to fetch the latest transaction data for this user
const refreshConnections = (userId) => {

};

module.exports = {
    getTransactions,
    getHealthCheck,
    refreshConnections,
};