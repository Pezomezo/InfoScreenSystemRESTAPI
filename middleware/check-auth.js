const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
   
    try {
         const decode = jwt.verify(req.body.token, 'secret');
         req.userData = decoded;
         next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        })
    }
}