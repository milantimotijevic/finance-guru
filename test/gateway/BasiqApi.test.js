const Boom = require('@hapi/boom');
const axios = require('axios');
const BasiqApi = require('../../src/gateway/BasiqApi');

jest.mock('axios');

afterEach(() => {
    BasiqApi.clearToken();
});

test('getTransactions', async () => {
    axios.mockResolvedValueOnce({
        data: {
            access_token: 'testtoken',
            token_type: 'Bearer',
            expires_in: 3600
        }
    })
    .mockResolvedValueOnce({
        data: {
            type: 'list',
            count: 1,
            size: 1,
            data: [{
                type: 'transaction',
                id: '67985501-f0b1-489b-a460-7662e85be689',
                status: 'posted',
                description: 'Contribution - Super Guarantee',
                amount: '609.69',
                account: '44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
                balance: '0.00',
                direction: 'credit',
                class: 'transfer',
                institution: 'AU00000',
                connection: 'f8c4644e-a93d-4ea7-b1ff-59f595cda027',
                enrich: null,
                transactionDate: '',
                postDate: '2023-04-13T00:00:00Z',
                subClass: {
                    title: 'Superannuation Funds',
                    code: '633'
                },
                links: {
                    self: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions/67985501-f0b1-489b-a460-7662e85be689',
                    account: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/accounts/44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
                    institution: 'https://au-api.basiq.io/institutions/AU00000',
                    connection: null
                }
            }]
        },
    });

    const result = await BasiqApi.getTransactions('c9f76ad8-491d-4a81-b68b-653672dfa6e7');

    expect(result).toEqual([{
        type: 'transaction',
        id: '67985501-f0b1-489b-a460-7662e85be689',
        status: 'posted',
        description: 'Contribution - Super Guarantee',
        amount: '609.69',
        account: '44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
        balance: '0.00',
        direction: 'credit',
        class: 'transfer',
        institution: 'AU00000',
        connection: 'f8c4644e-a93d-4ea7-b1ff-59f595cda027',
        enrich: null,
        transactionDate: '',
        postDate: '2023-04-13T00:00:00Z',
        subClass: {
            title: 'Superannuation Funds',
            code: '633'
        },
        links: {
            self: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions/67985501-f0b1-489b-a460-7662e85be689',
            account: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/accounts/44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
            institution: 'https://au-api.basiq.io/institutions/AU00000',
            connection: null
        }
    }]);
});

test('getTransactions passes with only a few failed fetches', async () => {
    axios.mockResolvedValueOnce({
        data: {
            access_token: 'testtoken',
            token_type: 'Bearer',
            expires_in: 3600
        }
    });

    axios.mockRejectedValueOnce(new Error('Unknown error'))
    .mockRejectedValueOnce(new Error('Unknown error'))
    .mockRejectedValueOnce(new Error('Unknown error'));

    axios.mockResolvedValueOnce({
        data: {
            type: 'list',
            count: 1,
            size: 1,
            data: [{
                type: 'transaction',
                id: '67985501-f0b1-489b-a460-7662e85be689',
                status: 'posted',
                description: 'Contribution - Super Guarantee',
                amount: '609.69',
                account: '44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
                balance: '0.00',
                direction: 'credit',
                class: 'transfer',
                institution: 'AU00000',
                connection: 'f8c4644e-a93d-4ea7-b1ff-59f595cda027',
                enrich: null,
                transactionDate: '',
                postDate: '2023-04-13T00:00:00Z',
                subClass: {
                    title: 'Superannuation Funds',
                    code: '633'
                },
                links: {
                    self: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions/67985501-f0b1-489b-a460-7662e85be689',
                    account: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/accounts/44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
                    institution: 'https://au-api.basiq.io/institutions/AU00000',
                    connection: null
                }
            }]
        },
    });

    const result = await BasiqApi.getTransactions('c9f76ad8-491d-4a81-b68b-653672dfa6e7');

    expect(result).toEqual([{
        type: 'transaction',
        id: '67985501-f0b1-489b-a460-7662e85be689',
        status: 'posted',
        description: 'Contribution - Super Guarantee',
        amount: '609.69',
        account: '44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
        balance: '0.00',
        direction: 'credit',
        class: 'transfer',
        institution: 'AU00000',
        connection: 'f8c4644e-a93d-4ea7-b1ff-59f595cda027',
        enrich: null,
        transactionDate: '',
        postDate: '2023-04-13T00:00:00Z',
        subClass: {
            title: 'Superannuation Funds',
            code: '633'
        },
        links: {
            self: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions/67985501-f0b1-489b-a460-7662e85be689',
            account: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/accounts/44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
            institution: 'https://au-api.basiq.io/institutions/AU00000',
            connection: null
        }
    }]);
});

test('getTransactions fails with too many failed fetches', async () => {
    axios.mockResolvedValueOnce({
        data: {
            access_token: 'testtoken',
            token_type: 'Bearer',
            expires_in: 3600
        }
    });
    
    axios.mockRejectedValueOnce(new Error('Unknown error'))
    .mockRejectedValueOnce(new Error('Unknown error'))
    .mockRejectedValueOnce(new Error('Unknown error'))
    .mockRejectedValueOnce(new Error('Unknown error'))
    .mockRejectedValueOnce(new Error('Unknown error'));

    axios.mockResolvedValueOnce({
        data: {
            type: 'list',
            count: 1,
            size: 1,
            data: [{
                type: 'transaction',
                id: '67985501-f0b1-489b-a460-7662e85be689',
                status: 'posted',
                description: 'Contribution - Super Guarantee',
                amount: '609.69',
                account: '44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
                balance: '0.00',
                direction: 'credit',
                class: 'transfer',
                institution: 'AU00000',
                connection: 'f8c4644e-a93d-4ea7-b1ff-59f595cda027',
                enrich: null,
                transactionDate: '',
                postDate: '2023-04-13T00:00:00Z',
                subClass: {
                    title: 'Superannuation Funds',
                    code: '633'
                },
                links: {
                    self: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions/67985501-f0b1-489b-a460-7662e85be689',
                    account: 'https://au-api.basiq.io/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/accounts/44f7e034-a209-4dd0-ab6c-ef7f6f42440a',
                    institution: 'https://au-api.basiq.io/institutions/AU00000',
                    connection: null
                }
            }]
        },
    });

    expect(BasiqApi.getTransactions('c9f76ad8-491d-4a81-b68b-653672dfa6e7'))
        .rejects.toThrow(new Boom.notFound('Failed to connect to Basiq server'));
});