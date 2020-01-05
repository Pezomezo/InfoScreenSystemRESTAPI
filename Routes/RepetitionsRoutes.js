const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const middleware = require('../middleware/check-auth');

//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from Repetition')
        res.status(200).json({
            response: result.recordsets[0]
        })
        console.dir(result)
    } catch (err) {
        console.log('Error happened: ' + err);
    }
});

//GET by ID
router.get('/:repetitionID',async (req, res, next) => {
    try {
        const repetitionID = req.params.repetitionID;
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from Repetition WHERE ID = ' + repetitionID)
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
        //Automatic ID creation
        //Getting last ID in table
        const LastID = await pool.request().query('SELECT TOP 1 ID FROM Repetition ORDER BY ID DESC;  ')
        //Checking wether data came back or not
        //If mp data came back that mean the table is empty so the new ID will be 1
        if(LastID.recordset[0]){
            newID = parseInt(LastID.recordset[0].ID +1)
        }
        else{
            newID = 1
        }
        const result = await pool.request().query("INSERT INTO Repetition VALUES ('" + req.body.RepetitionName + "');")
        res.status(200).json({
            response: result
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:repetitionID', middleware, async (req, res, err) => {
    try {
        const repetitionID = req.params.repetitionID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from Repetition WHERE ID = ' + repetitionID)
        if (getResult.recordset[0]) {
            const result = await pool.request().query("UPDATE Repetition SET RepetitionName ='" + req.body.RepetitionName + "' ;")
            res.status(200).json({
                response: result
            })
        } else {
            res.status(404).json({
                response: "There is no data associated with this ID: " + repetitionID
            })
        }
        
    }catch (err) {
        res.status(400).json({
            response: err
        })
    }
});

//DELETE
router.delete('/:repetitionID', middleware, async (req, res, err) => {
    try {
        var repetitionID = req.params.repetitionID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from Repetition WHERE ID = ' + repetitionID)
        if (getResult.recordset[0]) {
            const result = await pool.request().query("DELETE FROM Repetition WHERE ID='" + repetitionID + "';")
        
            res.status(200).json({
                response: result
            })
        }else{
            res.status(404).json({
                response: "There is no data associated with this ID: " + repetitionID
            })
        }
        
    }catch (err) {
        res.status(400).json({
            response: result
        })
    }
    
})

module.exports = router;
