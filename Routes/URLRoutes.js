const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')

//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from URL_Table;')
        res.status(200).json({
            response: result.recordsets[0]
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
        const LastID = await pool.request().query('SELECT TOP 1 ID FROM URL_Table ORDER BY Url_ID DESC;  ')
        //Checking wether data came back or not
        //If mp data came back that mean the table is empty so the new ID will be 1
        if(LastID.recordset[0]){
            newID = parseInt(LastID.recordset[0].ID +1)
        }
        else{
            newID = 1
        }
        try{
            const result = await pool.request().query("INSERT INTO URL_Table VALUES ('" + newID + "', '" + req.body.Name + "', '" + req.body.URL + "', '" 
                                                                                        + req.body.presentationID + "', '" + req.body.magicID + "');")
            res.status(200).json({
                response: result
            })
        }catch (err){
            res.status(400).json({
                error: err
            })
        }
       
    }catch (err) {
        console.log('Error happened: ' + err);
        res.status(500).json({
            message: err
        })
    }
});

//UPDATE
router.patch('/:URLID', async (req, res, err) => {
    try {
        const URL_ID = req.params.URLID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from URL_Table WHERE URL_ID = ' + URL_ID +';')
        if(getResult.recordset[0] ){
            const result = await pool.request().query("UPDATE URL_Table SET Url_Name ='" + req.body.Name + 
                                                      "', URL = '" + req.body.URL +
                                                      "', Settings_ID = '" + req.body.presentationID + 
                                                      "', MagicSettings_ID = '" + req.body.magicID +
                                                      "' WHERE Url_ID ='" + URL_ID + "' ;")
            res.status(200).json({
                response: result
            })
        }else{
            res.status(404).json({
            response: "There is no data associated with the id:" + URL_ID
            })
        }
    }catch (err) {
        res.status(400).json({
            response: err
        })
    }
});

//DELETE
router.delete('/:URLID', async (req, res, err) => {
    try {
        var id = req.params.URLID;
    let pool = await poolpromise;
    const getResult = await pool.request().query('select * from URL_Table WHERE Url_ID = ' + URL_ID +';')
    if(getResult.recordset[0] ){
        const result = await pool.request().query("DELETE FROM URL_Table WHERE Url_ID='" + id + "';")
        
        res.status(200).json({
            response: result
        })
    }else{
        res.status(404).json({
            response: "There is no data associated with this ID: " + id
        })
    }
    }catch (err) {
        res.status(400).json({
            response: result
        })
    }
})

module.exports = router;
