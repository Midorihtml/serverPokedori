const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemonRoutes = require('./pokemon.routes');
const typeRoutes = require('./type.routes');

const router = Router();

// Configurar los routerscd 
// Ejemplo: router.use('/auth', authRouter);
router.use('/pokemons', pokemonRoutes);
router.use('/types', typeRoutes);

module.exports = router;
