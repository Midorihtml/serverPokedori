const axios = require('axios');

const prechargeTypes = async () => {

    const { data } = await axios('https://pokeapi.co/api/v2/type');
    const types = data.results.map(e => {
        const id = e.url.split('/');
        return {
            id: id[6],
            name: e.name,
        }
    })
    return types;
}

module.exports = prechargeTypes;