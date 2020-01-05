const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


router.post('/signup', async (req, res, err) => {
    try {
        console.log('before the poolpromise');
        const pool = await poolpromise
        console.log('after the pool promise');
        const userCheck = await pool.request().query("select * from TblUser where Email = '" + req.body.username + "'");
        console.log(userCheck.recordsets[0].length );
        if (userCheck.recordsets[0].length !== 0){
            console.log(userCheck);
            res.status(400).json({
                message: 'user already exists'
            })
        }else {
            console.log('inside the else block')
            bcrypt.hash(req.body.password,10, async (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                } else {
                    try {
                        console.log(hash);
                        const result = await pool.request().query("INSERT INTO TblUser VALUES ('" +  req.body.username + "', '" + hash + "');");
                        res.status(200).json({
                            message: "User signed up!",
                            result: result
                        })
                    } catch (error) {
                        res.status(500).json({
                            message: 'user sign up failed',
                            err: error
                        })
                    }
                    
                }
            
            })
        }
    } catch (err) {
        res.status(400).json({
            message: 'something went wrong',
            error: err
        })
    }
    
});

router.post('/login', async (req, res, err) => {
    try {
        const pool = await poolpromise;
        userCheck = await pool.request().query("select * from TblUser where Email = '" + req.body.username + "';");
        if (userCheck.recordsets[0].length !== 0){
            bcrypt.compare(req.body.password, userCheck.recordsets[0][0].UserPassword, (err, result) => {
                if (err) {
                    return res.status(401).json({
                    message: 'Auth failed',
                    error: err
                    });
                } 
                if (result) {
                    const token = jwt.sign({ 
                        email: userCheck.recordsets[0].Email,
                        userID: userCheck.recordsets[0].UserID
                    }, 'secret', { expiresIn: '1h'} );
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed ittne',
                    error: err
                    });
            })
        }else {
            res.status(400).json({
                message: 'Email or password invalid'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Auth failed'
        });
    }
})

module.exports = router;