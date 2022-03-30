const { Router } = require('express');
const { Type } = require('../db')
const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const allTypes = await Type.findAll();
        res.json(allTypes)

    } catch (e) {
        next(e)
        res.send('Type not found')
    }
});

module.exports = router;