// export DEBUG=app:startup,app:db -> OR export DEBUG=app:* -> OR without env vars DEBUG=app:db nodemon index.js
const debug = require('debug')('app:startup'); //returns a function, we call it and give it and arg which is namespace for debugging
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const home = require('./routes/home');
const express = require('express');
const config = require('config');
const app = express();

//Templates
app.set('view engine', 'pug'); // no need to require, express with understand
app.set('views', './views'); // default

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use('/api/genres', genres); //for any routes started with this pass use this router
app.use('/', home);

//Configuration
console.log(`Application name : ${config.get('name')}`);
console.log(`Mail server : ${config.get('mail.host')}`);
console.log(`Mail server pass : ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log('Morgan enabled') -> replace with a call to debug fn
    debug('Morgan enabled');
}
// Db work log
dbDebugger('Conneted to the Database');


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));
