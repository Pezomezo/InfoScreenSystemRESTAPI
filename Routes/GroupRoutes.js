const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')

//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query('select * from Groups')
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
        var newID = null
        let pool = await poolpromise;
        //Automatic ID creation
        //Getting last ID in table
        const LastID = await pool.request().query('SELECT TOP 1 ID FROM Groups ORDER BY GroupID DESC;  ')
        //Checking wether data came back or not
        //If mp data came back that mean the table is empty so the new ID will be 1
        if (LastID.recordset[0]){
            newID = parseInt(LastID.recordset[0].ID +1)
        }else{
            newID = 1
        }
        const result = await pool.request().query("INSERT INTO Groups VALUES ('" + newID + "', '" + req.body.Name + "');")
        res.status(200).json({
            response: result
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:groupID', async (req, res, err) => {
    try {
        const groupID = req.params.groupID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from Groups WHERE GroupID = ' + groupID)
        if (getResult.recordset[0]) {
            const result = await pool.request().query("UPDATE Groups SET GroupName ='" + req.body.Name + 
                                                     "' WHERE GroupID ='" + groupID + "' ;")
            res.status(200).json({
                response: result
            })
        } else {
            res.status(404).json({
                response: "There is no data associated with this ID: " + groupID
            })
        }
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//DELETE
router.delete('/:groupID', async (req, res, err) => {
    try {
        var groupID = req.params.groupID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from Groups WHERE GroupID = ' + groupID)
        if (getResult.recordset[0]) {
            const result = await pool.request().query("DELETE FROM Groups WHERE GroupID='" + groupID + "';")
        
            res.status(200).json({
                response: result
            })
        }else{
            res.status(404).json({
                response: "There is no data associated with this ID: " + groupID
            })
        }
       
    }catch (err) {
        console.log('Error happened: ' + err);
    }
    
})

module.exports = router;
