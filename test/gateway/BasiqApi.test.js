const Boom = require('@hapi/boom');
const Logger = require('../../src/util/Logger');
const axios = require('axios');
const BasiqApi = require('../../src/gateway/BasiqApi');

jest.mock('../../src/util/Logger');
jest.mock('axios');

test('getTransactions', async () => {
    const infoLogSpy = jest.spyOn(Logger, 'info');

    // mock login
    axios.mockResolvedValueOnce({
        data: {
            access_token: 'testtoken',
            token_type: 'Bearer',
            expires_in: 3600
        }
    });

    // mock fetching transaction list
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

    expect(infoLogSpy.mock.calls).toEqual([
        [
            'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
        ],
        ['Fetched new access_token']
    ]);
});

test('getTransactions passes with 3 failed fetches', async () => {
    const infoLogSpy = jest.spyOn(Logger, 'info');
    const warnLogSpy = jest.spyOn(Logger, 'warn');

    // mock login
    axios.mockResolvedValueOnce({
        data: {
            access_token: 'testtoken',
            token_type: 'Bearer',
            expires_in: 3600
        }
    });

    axios.mockRejectedValueOnce(new Error('Unknown error'));
    axios.mockRejectedValueOnce(new Error('Unknown error'));
    axios.mockRejectedValueOnce(new Error('Unknown error'));

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

    expect(infoLogSpy.mock.calls).toEqual([
        [
            'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
        ],
        [
            'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
        ],
        [
            'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
        ],
        [
            'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
        ],
        [
            'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
        ]
    ]);

    expect(warnLogSpy.mock.calls).toEqual([
        [
            "Failed to fetch a batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions, retries so far: 0. Error: TypeError: Cannot read properties of undefined (reading 'length')"
        ],
        [
            'Failed to fetch a batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions, retries so far: 1. Error: Error: Failed to connect to Basiq server'
        ],
        [
            'Failed to fetch a batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions, retries so far: 2. Error: Error: Failed to connect to Basiq server'
        ],
        [
            'Failed to fetch a batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions, retries so far: 3. Error: Error: Failed to connect to Basiq server'
        ]
    ]);
});

test('getTransactions fails with 4 failed fetches', async () => {
    const infoLogSpy = jest.spyOn(Logger, 'info');

    // mock login
    axios.mockResolvedValueOnce({
        data: {
            access_token: 'testtoken',
            token_type: 'Bearer',
            expires_in: 3600
        }
    });

    axios.mockRejectedValueOnce(new Error('Unknown error'));
    axios.mockRejectedValueOnce(new Error('Unknown error'));
    axios.mockRejectedValueOnce(new Error('Unknown error'));
    axios.mockRejectedValueOnce(new Error('Unknown error'));

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

    expect(infoLogSpy.mock.calls).toEqual(
        [
            [
                'Fetching transactions batch from undefined/users/c9f76ad8-491d-4a81-b68b-653672dfa6e7/transactions'
            ]
        ]
    );
});