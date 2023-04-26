const axios = require('axios');
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
    oneHourAgo.setMinutes(oneHourAgo.getMinutes() - 58);

    if (!accessTokenWrapper || !accessTokenWrapper.expires || (oneHourAgo > accessTokenWrapper.expires)) {
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

async function getTransactionsBatch (url) {
    // TODO implement retry mechanism
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

    do {
        const { batch, nextBatchUrl } = await getTransactionsBatch(batchUrl);
        if (batch.length > 0) {
            transactions = transactions.concat(batch);
        }
        batchUrl = nextBatchUrl;
    } while (batchUrl);

    return transactions;
};

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

module.exports = {
    getTransactions,
    getHealthCheck,
};