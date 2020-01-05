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
const User = require('./Routes/User');
const Repetitions = require('./Routes/RepetitionsRoutes');
const PowerStates = require('./Routes/PowerStatesRoutes');

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
app.use('/api/user', User);
app.use('/api/repetition', Repetitions);
app.use('/api/powerstates', PowerStates);

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