const router = require('express').Router();

module.exports = () => {
    router.get('/', (req, res) => {
        res.send('Hello world!');
    });
    return router;
};
