const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Movies',
        message: 'Lets watch a movie'
    })
});


module.exports = router;
