const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const middleware = require('../middleware/check-auth');


//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from MagicSettings')
        res.status(200).json({
            response: result.recordsets[0]
        })
        console.dir(result)
    } catch (err) {
        console.log('Error happened: ' + err);
    }
});

//GET by ID
router.get('/:magicID',async (req, res, next) => {
    try {
        const magicID = req.params.magicID;
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from MagicSettings WHERE MagicID = ' + magicID)
        res.status(200).json({
            response: result.recordsets[0]
        })
        console.dir(result)
    } catch (err) {
        console.log('Error happened: ' + err);
    }
});

//POST
router.post('/', middleware, async (req, res, err) => {
    try {
        var newID = null
        let pool = await poolpromise;
        const result = await pool.request().query("INSERT INTO MagicSettings VALUES ('" + req.body.width + 
                                                    "', '" + req.body.heigth + "');")
        res.status(200).json({
            response: result
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:magicID', middleware, async (req, res, err) => {
    try {
        const magicID = req.params.magicID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from MagicSettings WHERE MagicID = ' + magicID)
        if (getResult.recordset[0]) {
            const result = await pool.request().query("UPDATE MagicSettings SET Widht ='" + req.body.width + 
                                                     "', Height = '" + req.body.heigth +
                                                      "' WHERE MagicID ='" + magicID + "' ;")
            res.status(200).json({
                response: result
            })
        } else {
            res.status(404).json({
                response: "There is no data associated with this ID: " + magicID
            })
        }
        
    }catch (err) {
        res.status(400).json({
            response: err
        })
    }
});

//DELETE
router.delete('/:magicID', middleware, async (req, res, err) => {
    try {
        var magicID = req.params.magicID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from MagicSettings WHERE MagicID = ' + magicID)
        if (getResult.recordset[0]) {
            const result = await pool.request().query("DELETE FROM MagicSettings WHERE MagicID='" + magicID + "';")
        
            res.status(200).json({
                response: result
            })
        }else{
            res.status(404).json({
                response: "There is no data associated with this ID: " + magicID
            })
        }
        
    }catch (err) {
        res.status(400).json({
            response: result
        })
    }
    
})

module.exports = router;
