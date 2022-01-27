const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./logger');
const Joi = require('joi');
const express = require('express');
const config = require('config');
// export DEBUG=app:startup,app:db -> OR export DEBUG=app:* -> OR without env vars DEBUG=app:db nodemon index.js
const debug = require('debug')('app:startup'); //returns a function, we call it and give it and arg which is namespace for debugging
const dbDebugger = require('debug')('app:db');

const app = express();

app.set('view engine', 'pug'); // no need to require, express with understand
app.set('views', './views'); // default

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());

//Configuration
console.log(`Application name : ${config.get('name')}`);
console.log(`Mail server : ${config.get('mail.host')}`);
console.log(`Mail server pass : ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log('Morgan enabled') -> replace with a call to debug fn
    debug('Morgan enabled');
}
//Db work
//dbDebugger('Conneted to the Database');

app.use(logger);

app.listen(port, () => console.log(`Listening on port ${port}....`));

const genres = [
    {id: 1, name: 'Horror'},
    {id: 2, name: 'Action'},
    {id: 3, name: 'Drama'}
];

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Movies',
        message: 'Lets watch a movie'
    })
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`There is no such genre with the given id ${id}`);
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const { error } = validadateGenreRequest(req.body);
    if (error) return res.status(400).send(error.message);
    
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`There is no such genre with the given id ${id}`);

    const { error } = validadateGenreRequest(req.body);
    if (error) return res.status(400).send(error.message);

    genre.name = req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req,res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`There is no such genre with the given id ${id}`);

    const idx = genres.indexOf(genre);
    genres.splice(idx, 1);

    res.send(genre);
});

function validadateGenreRequest(genreRequest) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    
    return schema.validate(genreRequest);
}
