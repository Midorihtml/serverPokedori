const { Router } = require('express');
const { Pokemon, Type } = require('../db')
const axios = require('axios');

const router = Router();

router.get('/', async (req, res, next) => {
    const { name } = req.query;
    if (name) {
        try {
            const dbName = await Pokemon.findOne({
                where: {
                    name: name,
                },
                include: [{
                    model: Type
                }]
            })
            if (dbName !== null) {
                const result = {
                    id: dbName.id,
                    name: dbName.name,
                    hp: dbName.hp,
                    attack: dbName.attack,
                    defense: dbName.defense,
                    speed: dbName.speed,
                    height: dbName.height,
                    weight: dbName.weight,
                    image: dbName.image,
                    types: dbName.types.map(e => {
                        return e.name
                    })
                }
                return res.json(result)
            } else {
                const { data } = await axios(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const result = {
                    id: data.id,
                    name: data.name,
                    hp: data.stats[0].base_stat,
                    attack: data.stats[1].base_stat,
                    defense: data.stats[2].base_stat,
                    speed: data.stats[3].base_stat,
                    height: data.height,
                    weight: data.weight,
                    image: data.sprites.other.home.front_default,
                    types: data.types.map(e => {
                        return e.type.name
                    })
                }
                return res.json(result)
            }

        } catch (e) {
            res.status(404);
            res.send('Name not found')
        }
    } else {
        try {
            let dbPokemon = await Pokemon.findAll({
                include: [{
                    model: Type,
                    atributtes: name
                }]
            });
            dbPokemon = dbPokemon.map(e => {
                return {
                    name: e.name,
                    image: e.image,
                    types: e.types.map(type => {
                        return type.name
                    })
                }
            })

            const promiseArray = [];
            for (let i = 1; i <= 40; i++) {
                promiseArray.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`))
            }
            let result = await Promise.all(promiseArray);

            result = result.map(e => {
                return {
                    name: e.data.name,
                    image: e.data.sprites.other.home.front_default,
                    types: e.data.types.map(e => {
                        return e.type.name
                    })
                }
            })
            result = [...result, ...dbPokemon]
            res.json(result)

        } catch (e) {
            next(e);
            res.status(500)
            res.send('Error server')
        }
    }
})

router.get('/full', async (req, res, next) => {
    try {
        let dbPokemon = await Pokemon.findAll({
            include: [{
                model: Type,
            }]
        });
        dbPokemon = dbPokemon.map(e => {
            return {
                id: e.id,
                name: e.name,
                hp: e.hp,
                attack: e.attack,
                defense: e.defense,
                speed: e.speed,
                height: e.height,
                weight: e.weight,
                image: e.image,
                types: e.types.map(type => {
                    return type.name
                })
            }
        })
        const promiseArray = [];
        for (let i = 1; i <= 40; i++) {
            promiseArray.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`))
        }
        let result = await Promise.all(promiseArray);

        result = result.map(e => {
            return {
                id: e.data.id,
                name: e.data.name,
                hp: e.data.stats[0].base_stat,
                attack: e.data.stats[1].base_stat,
                defense: e.data.stats[2].base_stat,
                speed: e.data.stats[3].base_stat,
                height: e.data.height,
                weight: e.data.weight,
                image: e.data.sprites.other.home.front_default,
                types: e.data.types.map(e => {
                    return e.type.name
                })
            }
        })
        result = [...result, ...dbPokemon]
        res.json(result)

    } catch (e) {
        next(e);
        res.status(500)
        res.send('Error server')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (id.includes('-')) {
            const pokemon = await Pokemon.findAll({
                where: {
                    id: id
                },
                include: [{
                    model: Type
                }]
            });
            const result = {
                id: pokemon[0].id,
                name: pokemon[0].name,
                hp: pokemon[0].hp,
                attack: pokemon[0].attack,
                defense: pokemon[0].defense,
                speed: pokemon[0].speed,
                height: pokemon[0].height,
                weight: pokemon[0].weight,
                image: pokemon[0].image,
                types: pokemon[0].types.map(e => {
                    return e.name
                })
            }
            res.json(result)
        } else {
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const result = {
                id: data.id,
                name: data.name,
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                speed: data.stats[3].base_stat,
                height: data.height,
                weight: data.weight,
                image: data.sprites.other.home.front_default,
                types: data.types.map(e => {
                    return e.type.name
                })
            }
            res.json(result)
        }
    } catch (e) {
        res.status(404);
        res.send('Not found Id');
    }
})

router.post('/', async (req, res, next) => {
    const { name, hp, attack, defense, speed, height, weight, image, typeId } = req.body;
    try {
        const newPokemon = await Pokemon.create({
            name,
            hp,
            attack,
            defense,
            speed,
            height,
            weight,
            image
        })
        //const idNewPokemon = newPokemon.id;
        const pokemonCreated = await Pokemon.findByPk(newPokemon.id)
        pokemonCreated.addTypes(typeId);
        res.json(pokemonCreated)
    } catch (e) {
        next(e);
        res.send('Creation failed')
    }
})

router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, hp, attack, defense, speed, height, weight, image, typeId } = req.body;
    try {
        await Pokemon.update(
            {
                name,
                hp,
                attack,
                defense,
                speed,
                height,
                weight,
                image,
                typeId
            },
            {
                where: {
                    id: id,
                }
            })
        res.send('Success update');
    } catch (e) {
        next(e)
        res.send('Update failed')
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Pokemon.destroy({
            where: {
                id: id
            }
        })
        res.send('Deleted')
    } catch (e) {
        next(e);
        res.send('Delete failed')
    }
})


module.exports = router;