const axios = require('axios');

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
    oneHourAgo.setMinutes(oneHourAgo.getMinutes() - 59);

    if (!accessTokenWrapper || !accessTokenWrapper.expires || (oneHourAgo > accessTokenWrapper.expires)) {
        const tokenResponse = await fetchToken();
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() - tokenResponse.expires);
        accessTokenWrapper = {
            accessToken: tokenResponse.access_token,
            expires,
        };
    }

    return accessTokenWrapper.accessToken;
}

module.exports = {
    getToken,
};