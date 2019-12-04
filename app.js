const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express();
const tediousExpress = require('express4-tedious');

const InfoScreenRoutes = require('./Routes/InfoScreenRoutes')
// server  : "infoscreendb.database.windows.net",
//             username: 'Adamka',
//             password: "HorvathAdam98",
//             options: { encrypt: true, database: "InfoScreenDB" }
//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
               'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use(function (req, res, next) {
    console.log('Inside app db related');
    req.sql = tediousExpress({
        server: "infoscreendb.database.windows.net",
        // If you're on Windows Azure, you will need this:
        options: {encrypt: true, database: "InfoScreenDB"},
        authentication: {
          type: "default",
          options: {  
            userName: "Adamka",
            password: "HorvathAdam98",
          }
        }
        });
    console.log('Database connected');
    next();
});

//DEBUGGING
app.use(morgan('dev'));
//FOR PARSING JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setting up routes
app.use('/screen', InfoScreenRoutes);
//app.use('/group', GroupRoutes);
//app.use('/magic', MagicRoutes);
//app.use('/settings', PresentationRoutes);
//app.use('/collection', URLCollectionRoutes);
//app.use('/presentation', URLRoutes);

//ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

//EXPORTING
module.exports = app;