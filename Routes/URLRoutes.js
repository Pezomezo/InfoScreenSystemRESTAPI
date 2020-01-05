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
router.post('/', middleware, async (req, res, err) => {
    console.log('inside the post route')
         try {
            console.log(req.body.Repetition + ' - ' + req.body.TimeFrame + ' - ' + req.body.StartDate)
            const pool = await poolpromise
            const RepetitionID = await pool.request().query("SELECT ID FROM Repetition WHERE RepetitionName = '" + req.body.Repetition + "';");
            await pool.request().query("INSERT INTO PresentationSettings VALUES ('" + req.body.TimeFrame + 
                                                                                                "', '" + req.body.StartDate +
                                                                                                "', '" + RepetitionID.recordset[0].ID + "');");
            try {
                console.log(req.body.MagicWidht + ' - ' + req.body.MagicHeight)
                await pool.request().query("INSERT INTO MagicSettings VALUES ('" + req.body.MagicWidht +
                                                                                             "', '" + req.body.MagicHeight + "');");
                 try {
                    const presentationID = await pool.request().query("SELECT TOP 1 * FROM PresentationSettings ORDER BY PresentationID DESC")
                   
                    try {
                        const magicID = await pool.request().query("SELECT TOP 1 * FROM MagicSettings ORDER BY MagicID DESC")
                        try {
                            console.log(req.body.UrlName + ' - ' + req.body.URL + ' - ' + magicID.recordset[0].MagicID + ' - ' + presentationID.recordset[0].PresentationID)
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

router.patch('/:id', middleware, async (req, res, err) => {
    try {
        const id = req.params.id;
        console.log(id)
        const pool = await poolpromise;
        console.log(req.body.TimeFrame + ' - ' + req.body.StartDate + ' - ' + req.body.Repetition + ' - ' + req.body.PresentationID)
        const result = await pool.request().query("UPDATE PresentationSettings SET TimeFrame='" + req.body.TimeFrame + 
                                                              "', StartDate='" + req.body.StartDate + "', Repetition='" + req.body.Repetition +
                                                              "' WHERE PresentationID='" + req.body.PresentationID + "';");
        console.log(result)
        try {
            console.log(req.body.UrlName + ' - ' + req.body.URL + ' - ' + req.body.MagicID + ' - ' + req.body.PresentationID + ' - ' + id)
             const urlResult = await pool.request().query("UPDATE URL_Table SET UrlName='" + req.body.UrlName + 
                                                  "', URL='" + req.body.URL +
                                                   "', MagicID='" + req.body.MagicID + "', PresentationID='" 
                                                   + req.body.PresentationID + "' WHERE UrlID='" + id + "';")
            res.status(200).json({
                mesage: 'Success'
            })
        } catch (error) {
            res.status(500).json({
                message: 'URL_Table could not get updated'
            })
        }
    } catch (error) {
        res.status(500).json({
            mesage: 'The PresentationSettings could not get updated'
        })
    }
})

router.delete('/:id', middleware, async (req, res, err) => {
    try {
        const id = req.params.id;
        console.log(id);
        const pool = await poolpromise;
        const search = await pool.request().query("SELECT * FROM URL_Table WHERE UrlID=" + id);
        if (search.recordset[0]) {
            const result = await pool.request().query("DELETE FROM URL_Table WHERE UrlID ='" + id + "';")
            res.status(200).json({
                message: 'success'
            });
        }else {
            res.status(404).json({
                message: search
            });
        }
        
        
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})

module.exports = router;
