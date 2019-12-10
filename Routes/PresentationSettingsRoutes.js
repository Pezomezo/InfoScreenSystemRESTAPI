const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')

//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from PresentationSettings')
        res.status(200).json({
            response: result
        })
        console.dir(result)
    } catch (err) {
        console.log('Error happened: ' + err);
    }
});

//POST
router.post('/', async (req, res, err) => {
    try {
        var newID = null;
        let pool = await poolpromise;
        //Automatic ID creation
        //Getting last ID in table
        const LastID = await pool.request().query('SELECT TOP 1 ID FROM PresentationSettings ORDER BY PresentationID DESC;  ')
        //Checking wether data came back or not
        //If mp data came back that mean the table is empty so the new ID will be 1
        if(LastID.recordset[0]){
            newID = parseInt(LastID.recordset[0].ID +1)
        }
        else{
            newID = 1
        }
        const result = await pool.request().query("INSERT INTO PresentationSettings VALUES ('" + newID + "', '" + req.body.Repetition + 
                                                    "', '" + req.body.Time_Frame + "', '" + req.body.Date + "');")
        res.status(200).json({
            response: result
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:settingsID', async (req, res, err) => {
    try {
        const settingsID = req.params.settingsID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from PresentationSettings WHERE PresentationID = ' + settingsID)
        if(getResult.recordset[0]){
            const result = await pool.request().query("UPDATE PresentationSettings SET Repetition ='" + req.body.Repetition + 
                                                      "', Time_Frame = '" + req.body.Time_Frame +
                                                      "', Date = '" + req.body.Date + "' WHERE PresentationID ='" + settingsID + "' ;")
            res.status(200).json({
            response: result
            })
        }else{
            res.status(404).json({
                response: "There is no data associated with this ID: " + settingsID
                })
        }
       
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//DELETE
router.delete('/:settingsID', async (req, res, err) => {
    try {
        var settingsID = req.params.settingsID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from PresentationSettings WHERE PresentationID = ' + settingsID)
        if(getResult.recordset[0]){
            const result = await pool.request().query("DELETE FROM PresentationSettings WHERE PresentationID='" + settingsID + "';")
        
            res.status(200).json({
                response: result
            })
        }else{
            res.status(404).json({
                response: "There is no data associated with this ID: " + settingsID
            })
        }
        
    }catch (err) {
        console.log('Error happened: ' + err);
    }
    
})

module.exports = router;
