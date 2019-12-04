const express = require('express');
const router = express.Router();

//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        console.log('Inside the InfoScreenROutew')
        req.sql('select * from InfoScreenPC for json path').into(res);
        
    } catch (err) {
        console.log('Error happened: ' + err);
    }
});

//POST
 router.post('/', async (req, res, err) => {
    try {
        //var newID = null;
        //Automatic ID creation
        //Getting last ID in table
        //const LastID = null;
        //req.sql('SELECT TOP 1 ID FROM InfoScreenPC ORDER BY ID DESC for json path;').into(res)
        //console.log('LAST ID: ' + LastID)
        //Checking wether data came back or not
        //If mp data came back that mean the table is empty so the new ID will be 1
        //if(LastID.recordset[0]){
        //    newID = parseInt(LastID.recordset[0].ID +1)
        //    console.log(newID)
        //}
        //else{
        //    newID = 1
        //    console.log(newID)
        //}
        
        req.sql("INSERT INTO InfoScreenPC VALUES ('" + req.body.ID + "', '" + req.body.Name + "', '" + req.body.Power_State + "');").exec(res);

        //const result = await pool.request().query("INSERT INTO InfoScreenPC VALUES ('" + newID + "', '" + req.body.Name + "', '" + req.body.Power_State + "');")
        
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});
/*
//UPDATE
router.patch('/:screenID', async (req, res, err) => {
    try {
        const pc_ID = req.params.screenID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from InfoScreenPC')
        if (getResult.recordset[0]) {
            const result = await pool.request().query("UPDATE InfoScreenPC SET Name ='" + req.body.Name + 
                                                     "', Power_State = '" + req.body.Power_State +
                                                      "' WHERE ID ='" + pc_ID + "' ;")
            res.status(200).json({
                response: result
            })
        } else {
            res.status(404).json({
                response: "There is no data associated with this ID: " + pc_ID
            })
        }
        
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//DELETE
router.delete('/:screenID', async (req, res, err) => {
    try {
        var id = req.params.screenID;
        let pool = await poolpromise;
        const getResult = await pool.request().query('select * from InfoScreenPC')
        if (getResult.recordset[0]) {
            const result = await pool.request().query("DELETE FROM InfoScreenPC WHERE ID='" + id + "';")
        
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
 */
module.exports = router;
