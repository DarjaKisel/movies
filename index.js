const Joi = require('joi');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}....`));

const genres = [
    {id: 1, name: 'Horror'},
    {id: 2, name: 'Action'},
    {id: 3, name: 'Drama'}
];

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
