const express = require('express');
const router = express.Router();
const { poolpromise } = require('../Database/DatabaseSingleton')
const middleware = require('../middleware/check-auth');

const selectStatement = `SELECT C.CollectionID, G.GroupID, G.GroupName, I.InfoScreenPCID, I.InfoScreenPCName, I.PowerState, S.StateName,
U.UrlID, U.UrlName, U.URL, M.MagicID, M.Widht, M.Height, P.PresentationID, P.Repetition, R.RepetitionName,
P.TimeFrame, P.StartDate FROM URL_Table U 
Join URLCollections C ON U.UrlID = C.URLID
Join InfoScreenPC I ON I.InfoScreenPCID = C.InfoScreenID
Join PowerStates S ON I.PowerState = S.ID
JOIN Groups G ON G.GroupID = C.GroupID
Join MagicSettings M ON M.MagicID = U.MagicID
Join PresentationSettings P ON P.PresentationID = U.PresentationID
Join Repetition R ON R.ID = P.Repetition `

const individualScreensStatement = `SELECT C.CollectionID, I.InfoScreenPCID, I.InfoScreenPCName, I.PowerState, S.StateName,
U.UrlID, U.UrlName, U.URL, M.MagicID, M.Widht, M.Height, P.PresentationID, P.Repetition, R.RepetitionName,
P.TimeFrame, P.StartDate FROM URL_Table U 
join URLCollections C ON U.UrlID = C.URLID
Join InfoScreenPC I ON I.InfoScreenPCID = C.InfoScreenID
Join PowerStates S ON S.ID = I.PowerState
Join MagicSettings M ON M.MagicID = U.MagicID
Join PresentationSettings P ON P.PresentationID = U.PresentationID
Join Repetition R ON R.ID = P.Repetition WHERE  C.GroupID IS NULL `

//GET all collections and all data associated with them
router.get('/all',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query(selectStatement + 'ORDER BY G.GroupID ASC')
        console.log(result)
        res.status(200).json({
            response: result.recordsets[0]
        });
    } catch (err) {
        console.log('we in here');
        res.status(400).json({
            error: err
        });
    }
});

//GET all non-group collections and all data associated with them
router.get('/individual',async (req, res, next) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = await poolpromise
        const result = await pool.request().query(individualScreensStatement)
        console.log(result)
        res.status(200).json({
            response: result.recordsets[0]
        });
    } catch (err) {
        console.log('we in here');
        res.status(400).json({
            error: err
        });
    }
});

//GET specific group data
router.get('/:groupID', async (req, res, next) => {
    try {
        const pool = await poolpromise;
        const result = await pool.request().query(selectStatement + `WHERE G.GroupID = ` + req.params.groupID);

        res.status(200).json({
            response: result.recordset
        })

    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
});

//POST
router.post('/', middleware, async (req, res, err) => {
    try {
        let pool = await poolpromise;
        try {
            const result = await pool.request().query("INSERT INTO URLCollections VALUES ('" + req.body.Info_Screen_ID + "', '" 
                                                                                            + req.body.URL_ID + "', '" + req.body.groupID + "');")
            res.status(200).json({
                response: result
            })
        } catch (RequestError) {
            res.status(400).json({
                response: RequestError
            })
        }
        
    }catch (err) {
        console.log('Error happened: ' + err);
    }
});

//UPDATE
router.patch('/:collectionID', middleware, async (req, res, err) => {
    try {
        const collectionID = req.params.collectionID;
        let pool = await poolpromise;
        const result = await pool.request().query('select * from URLCollections WHERE ID = ' + collectionID)
        if (result.recordset[0]) {
            const result = await pool.request().query("UPDATE URLCollections SET Info_Screen_ID ='" + req.body.Info_Screen_ID + 
                                                      "', URL_ID = '" + req.body.URL_ID +
                                                      "', GroupID = '" + req.body.groupID +
                                                      "' WHERE ID = '" + collectionID + "' ;")
            res.status(200).json({
                response: "Success"
            })
        } else {
            res.status(404).json({
                response: "There is no data associated with this ID: " + collectionID
            })
        }
       
    }catch (err) {
        res.status(400).json({
            response: err
        })
    }
});

//DELETE
router.delete('/:collectionID', middleware, async (req, res, err) => {
    try {
        var collectionID = req.params.collectionID;
    let pool = await poolpromise;

    const result = await pool.request().query('select * from URLCollections WHERE ID = ' + collectionID)
    if (result.recordset[0]) {
        const result = await pool.request().query("DELETE FROM URLCollections WHERE ID='" + collectionID + "';")
    
        res.status(200).json({
            response: result
        })
    } else {
        res.status(404).json({
            response: "There is no data associated with this ID: " + collectionID
        })
    }
    }catch (err) {
        console.log('Error happened: ' + err);
    }
})

module.exports = router;
