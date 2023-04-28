const Boom = require('@hapi/boom');
const Logger = require('../../src/util/Logger');
const axios = require('axios');
const BasiqApi = require('../../src/gateway/BasiqApi');

jest.mock('../../src/util/Logger');
jest.mock('axios');

test('getTransactions', async () => {
    // TODO change await axios.post() call to await axios() or mock axios.post here
    const axiosSpy = jest.spyOn(axios, 'request');
    axios.mockResolvedValue({cat: 'meow'});
    axios.mockResolvedValue({cat: 'meow'});
    axios.mockResolvedValue({cat: 'meow'});
	const result = await BasiqApi.getTransactions();
    
    expect(1).toEqual(1)
});