const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')


const sqlJoin = `Select U.UrlID, U.UrlName, U.URL, P.PresentationID, P.Repetition, P.TimeFrame, P.StartDate, M.MagicID, M.Widht, M.Height From URL_Table U
Join PresentationSettings P ON P.PresentationID = U.PresentationID
Join MagicSettings M ON M.MagicID = U.MagicID `;

//GET
router.get('/',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query(sqlJoin)
        res.status(200).json({
            response: result.recordsets[0]
        })
        console.dir(result)
    } catch (err) {
        console.log('Error happened: ' + err);
    }
});

//GET by ID
router.get('/:urlID',async (req, res, next) => {
    try {
        const URL_ID = req.params.urlID;
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query(sqlJoin + ' WHERE U.UrlID = ' + URL_ID)
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
        var presentationID = null;
        var magicID = null;
        let pool = await poolpromise;
        /* try {
            const result = await pool.request().query("INSERT INTO PresentationSettings VALUES ('" + req.body.TimeFrame + 
                                                                                                "', '" + req.body.StartDate +
                                                                                                "', '" + req.body.Repetition + "');");
        } catch (error) {
            res.status(500).json({
                message: 'saving presentationsettings failed',
                err: error
            });
        }
        try {
            const result = await pool.request().query("INSERT INTO MagicSettings VALUES ('" + req.body.MagicWidht +
                                                                                         "', '" + req.body.MagicHeight + "');");
        } catch (error) {
            res.status(500).json({
                message: 'saving magic settings failed',
                err: error
            });
        } */
        try{
            console.log('Inside URL saving tryCatch')
            const getPresentatioNID = await pool.Request().query('SELECT TOP 1 PresentationID FROM PresentationSettings ORDER BY PresentationID DESC ');
            presentationID = getPresentatioNID;
            console.log('ResultID: ' + getPresentatioNID + ' - Presentation: ' + presentationID);
            const getMagicID = await pool.request().query("SELECT TOP 1 * FROM MagicSettings ORDER BY MagicID DESC;");
            magicID = getMagicID.recordsets[0].MagicID;
            console.log('PresentationID ' + presentationID + ' - Magic: ' + magicID);
            const result = await pool.request().query("INSERT INTO URL_Table VALUES ('" + req.body.UrlName + "', '" + req.body.URL + "', '" 
                                                                                        + presentationID + "', '" + magicID + "');")
            res.status(200).json({
                response: result
            })
        }catch (err){
            res.status(400).json({
                message: 'saving url failed',
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
