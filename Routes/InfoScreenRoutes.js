const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const middleware = require('../middleware/check-auth');


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
 router.post('/', middleware, async (req, res, err) => {
    try {
        const pool = await poolpromise
        const result = await pool.request().query("INSERT INTO InfoScreenPC VALUES ('" + req.body.Name + "', '" + req.body.Power_State + "');")
        
        res.status(200).json({
            message: 'Success'
        })
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:screenID', middleware, async (req, res, err) => {
    try {
        const pc_ID = req.params.screenID;
        let pool = await poolpromise;
        //const getResult = await pool.request().query("select * from InfoScreenPC")
        //console.log('getResulyt: ' + getResult)
        //if (getResult.recordset[0]) {
            const result = await pool.request().query("UPDATE InfoScreenPC SET InfoScreenPCName ='" + req.body.InfoScreenPCName + 
                                                     "', PowerState = '" + req.body.Power_State +
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
router.delete('/:screenID', middleware, async (req, res, err) => {
    try {
        var id = req.params.screenID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from InfoScreenPC')
        if (getResult.recordset[0]) {
            const result = await pool.request().query("DELETE FROM InfoScreenPC WHERE InfoScreenPCID='" + id + "';")
        
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
