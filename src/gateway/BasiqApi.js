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
async function getTransactionsBatch(url) {
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

async function getTransactions(userId) {
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

/**
 * @deprecated
 * Iterate over steps and ensure the target ones are complete
 */
function relevantStepsCompleted(jobsData, stepTitle) {
    for (let i = 0; i < jobsData.length; i++) {
        const job = jobsData[i];
        for (let j = 0; j < job.steps.length; j++) {
            const step = jobsData[i].steps[j];
            if (step.title === stepTitle && step.status !== 'success') {
                return false;
            }
        }
    }

    return true;
}

/**
 * @deprecated
 * Poll BasiqAPI and ensure all relevant jobs are completed
 */
async function awaitJobsCompletion(jobIds) {
    let retries = 0;

    while (retries < 30) {
        try {
            const access_token = await getToken();

            // create a promise for each job
            const promises = jobIds.map(jobId => axios.get(`${BASIQ_HOSTNAME}/jobs/${jobId}`,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }));

            // await all promises in parallel
            const results = await Promise.all(promises);
            const jobsData = results.map(result => result.data);

            // ensure at least 'retrieve-transactions' jobs are complete for all connections
            if (!relevantStepsCompleted(jobsData, 'retrieve-transactions')) {
                retries++;
                // force a short deplay
                await new Promise((resolve) => setTimeout(resolve, 200));
            } else {
                return true; // signifies the jobs are complete
            }

        } catch (err) {
            retries++;
            Logger.warn(`Failed to status for one or more jobs. Error: ${err}`);
            // force a short delay
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }

    return false; // we waited long enough, one or more jobs are still incomplete
}

// instruct BasiqAPI to fetch the latest transaction data for this user
const refreshConnections = async (userId) => {
    try {
        const access_token = await getToken();
        await axios.post(
            `${BASIQ_HOSTNAME}/users/${userId}/connections/refresh`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }
        );
    } catch (err) {
        Logger.error(`Failed to refresh connections for user ${userId}: ${err}`);
    }
};

module.exports = {
    getTransactions,
    getHealthCheck,
    refreshConnections,
};