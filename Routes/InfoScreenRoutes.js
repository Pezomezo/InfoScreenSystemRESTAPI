const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')

//GET
router.get('/',async (req, res, next) => {
    try {
        console.log('inside the route')
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query("select * from InfoScreenPC")
        res.status(200).json({
            response: result.recordset
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
        //Automatic ID creation
        //Getting last ID in table
        const pool = await poolpromise
        const LastID = await pool.request().query(`SELECT * FROM InfoScreenPC ORDER BY InfoScreenPCID DESC`);
        console.log('LAST ID: ' + LastID)
        //Checking wether data came back or not
        //If mp data came back that mean the table is empty so the new ID will be 1
        if(LastID.recordset[0]){
            newID = parseInt(LastID.recordset[0].ID +1)
            console.log('found: ' + newID)
        }
        
        else{
            newID = 1
            console.log('else: ' + newID)
        }
        
        //const result = await pool.request().query("INSERT INTO InfoSceenPC VALUES ('" + newID + "', '" + req.body.Name + "', '" + req.body.Power_State + "');")
        
        res.status(200).json({
            message: newID
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:screenID', async (req, res, err) => {
    try {
        const pc_ID = req.params.screenID;
        let pool = await poolpromise;
        //const getResult = await pool.request().query("select * from InfoScreenPC")
        //console.log('getResulyt: ' + getResult)
        //if (getResult.recordset[0]) {
            const result = await pool.request().query("UPDATE InfoScreenPC SET InfoScreenPCName ='" + req.body.InfoScreenPCName + 
                                                     "', PowerState = '" + req.body.PowerState +
                                                      "' WHERE InfoScreenPCID ='" + pc_ID + "' ;")
            res.status(200).json({
                response: result
            })
        //} else {
        //    res.status(404).json({
        //        response: "There is no data associated with this ID: " + pc_ID
        //    })
        //}
        
    }catch (err) {
        res.status(500).json({
            message: 'Error Happened',
            error: err
        })
    }
});

//DELETE
router.delete('/:screenID', async (req, res, err) => {
    try {
        var id = req.params.screenID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from InfoSceenPC')
        if (getResult.recordset[0]) {
            const result = await pool.request().query("DELETE FROM InfoSceenPC WHERE InfoScreenID='" + id + "';")
        
            res.status(200).json({
                response: result
            })
        }else{
            res.status(404).json({
                response: "There is no data associated with this ID: " + pc_ID
            })
        }
        
    }catch (err) {
        console.log('Error happened: ' + err);
    }
    
})

module.exports = router;
