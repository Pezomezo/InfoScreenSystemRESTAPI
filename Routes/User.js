const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


router.post('/signup', async (req, res, err) => {
    

    const pool = await poolpromise;
    userCheck = pool.request().query('select * from User where Email = ' + req.body.email);
    if (userCheck){
        res.status(400).json({
            message: 'user already exists'
        })
    }else {
        bcrypt.hash(req.body.password,10, (err, hash) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            } else {
                const result = pool.request().query("INSERT INTO USER VALUES ('" +  req.body.email + "', '" + hash + "';");
                res.status(200).json({
                    message: "User signed up!"
                })
            }
        
    })
        
    }
});

router.post('/login', async (req, res, err) => {
    const pool = await poolpromise;
    userCheck = pool.request().query('select * from User where Email = ' + req.body.email);
    if (userCheck){
        bcrypt.compare(req.body.password, userCheck.recordsets[0].password, (err, result) => {
            if (err) {
                res.status(401).json({
                message: 'Auth failed'
                });
            } 
            if (result) {
                const token = jwt.sign({
                    email: userCheck.recordsets[0].email,
                    userID: userCheck.recordsets[0].userID
                }, 'secret', { expiresIn: '1h'} )
                res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
                });
        })
    }else {
        res.status(400).json({
            message: 'Email or password invalid'
        })
    }

})

module.exports = router;