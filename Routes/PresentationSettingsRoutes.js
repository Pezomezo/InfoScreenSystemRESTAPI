const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const middleware = require('../middleware/check-auth');

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
router.post('/', middleware, async (req, res, err) => {
    try {
        let pool = await poolpromise;
        const result = await pool.request().query("INSERT INTO PresentationSettings VALUES ('" + req.body.Time_Frame + "', '"
         + req.body.Date + "', '" + req.body.Repetition + 
         "');")
        res.status(200).json({
            response: result
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:settingsID', middleware, async (req, res, err) => {
    try {
        console.log('inside the patch')
        const settingsID = req.params.settingsID;
        console.log(settingsID)
        console.log(req.body.RepetitionName)
        const pool = await poolpromise
        const RepetitionID = await pool.request().query("SELECT ID FROM Repetition WHERE RepetitionName = '" + req.body.RepetitionName + "';");
        console.log('RepetitionID: ' + RepetitionID);
        try {
            const getResult = await pool.request().query('select * from PresentationSettings WHERE PresentationID = ' + settingsID)
            if(getResult.recordset[0]){
                const result = await pool.request().query("UPDATE PresentationSettings SET Repetition ='" + RepetitionID.recordset[0].ID + 
                                                          "', TimeFrame = '" + req.body.Time_Frame +
                                                          "', StartDate = '" + req.body.Date + "' WHERE PresentationID ='" + settingsID + "' ;")
                res.status(200).json({
                    response: result
                })
            }else{
                res.status(404).json({
                    response: "There is no data associated with this ID: " + settingsID
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'Error while patching presentation',
                err: error
            })
        }
    }catch (err) {
        console.log('Error happened: ' + err);
        res.status(500).json({
            message: 'Something went wrong updating presentation settings',
            error: err
        })
    }
});

//DELETE
router.delete('/:settingsID', middleware, async (req, res, err) => {
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
