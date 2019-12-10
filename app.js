const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express();

const InfoScreenRoutes = require('./Routes/InfoScreenRoutes')
const GroupRoutes = require('./Routes/GroupRoutes')
const MagicRoutes = require('./Routes/MagicSettings')
const PresentationRoutes = require('./Routes/PresentationSettingsRoutes')
const URLCollectionRoutes = require('./Routes/URLCollectionRoutes')
const URLRoutes = require('./Routes/URLRoutes')

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

//app.use(function (req, res, next) {
//    console.log('Inside app db related');
//    req.sql = tediousExpress({
//        server: "info-screen-server.database.windows.net",
//        // If you're on Windows Azure, you will need this:
//        options: {encrypt: true, database: "infoScrennDB"},
//        authentication: {
//          type: "default",
//          options: {  
//            userName: "Adamka",
//            password: "HorvathAdam98",
//          }
//        }
//        });
//    console.log('Database connected');
//    next();
//});

//DEBUGGING
app.use(morgan('dev'));
//FOR PARSING JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setting up routes
app.use('/api/screen', InfoScreenRoutes);
app.use('/api/group', GroupRoutes);
app.use('/api/magic', MagicRoutes);
app.use('/api/settings', PresentationRoutes);
app.use('/api/collection', URLCollectionRoutes);
app.use('/api/presentation', URLRoutes);

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