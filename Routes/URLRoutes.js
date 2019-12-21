const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const middleware = require('../middleware/check-auth');


const sqlJoin = `Select U.UrlID, U.UrlName, U.URL, P.PresentationID, P.Repetition, R.RepetitionName, P.TimeFrame, P.StartDate, M.MagicID, M.Widht, M.Height From URL_Table U
Join PresentationSettings P ON P.PresentationID = U.PresentationID
Join MagicSettings M ON M.MagicID = U.MagicID
Join Repetition R ON R.ID = P.Repetition `;

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
    console.log('inside the post route')
         try {
            console.log(req.body.TimeFrame);           
            const pool = await poolpromise
            const PresentationSave = await pool.request().query("INSERT INTO PresentationSettings VALUES ('" + req.body.TimeFrame + 
                                                                                                "', '" + req.body.StartDate +
                                                                                                "', '" + req.body.Repetition + "');");
            console.log('settings saved')
            try {
                const magicSave = await pool.request().query("INSERT INTO MagicSettings VALUES ('" + req.body.MagicWidht +
                                                                                             "', '" + req.body.MagicHeight + "');");
                console.log('magic saved')
                 try {
        
                    const presentationID = await pool.request().query("SELECT TOP 1 * FROM PresentationSettings ORDER BY PresentationID DESC")
                    console.log(presentationID.recordset[0].PresentationID);
                   
                    try {
                        const magicID = await pool.request().query("SELECT TOP 1 * FROM MagicSettings ORDER BY MagicID DESC")
                        console.log(magicID)
                        console.log(magicID.recordset[0].MagicID);
                        try {
                            const result = await pool.request().query("INSERT INTO URL_Table VALUES ('" + req.body.UrlName + "', '" + req.body.URL + "', '" + magicID.recordset[0].MagicID + "', '" + presentationID.recordset[0].PresentationID + "');");
                            res.status(200).json({
                                message: 'Success'
                            })
                        } catch (error) {
                            res.status(500).json({
                                message: 'saving url failed'
                            })
                        }
                    } catch (error) {
                        res.status(500).json({
                            message: 'magic id selection failed'
                        })
                    }

                } catch (error) {
                    res.status(500).json({
                        message: "getting data failed",
                        err: error
                    })
                }
            } catch (error) {
                res.status(500).json({
                    message: 'saving magic settings failed',
                    err: error
                });
            } 
        } catch (error) {
            res.status(500).json({
                message: 'saving presentationsettings failed',
                err: error
            });
        }
})

module.exports = router;
