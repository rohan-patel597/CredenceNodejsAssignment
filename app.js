const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const movieRoutes = require('./api/routes/movies');

console.log('Using in-memory data store (no MongoDB required)');
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Aceess-Control-Allow-Headers", "Origin, X-Requested, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//Routes which handle requests
app.use('/movies', movieRoutes);


// middleware where the request will be pass through to check is it valid or not and at the not if not throws the error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It Works!'
//     });
// });

module.exports = app