const sql = require('mssql/msnodesqlv8');
var config = {
        server: `DESKTOP-JQ5PF54\\ADAMKASERVER`,
        database: "InfoScreenDB",
        // If you're on Windows Azure, you will need this:
        driver: "msnodesqlv8",
        options: {
          trustedConnection: true
        }
};

//const config = {
//  user: 'sa',
//  password: 'HorvathAdam98',
//  server: 'DESKTOP-JQ5PF54\\ADAMKASERVER', // You can use 'localhost\\instance' to connect to named instance
//  database: 'InfoScreenDB',
//}
const poolpromise = new sql.ConnectionPool(config)
.connect()
.then(pool => {
    console.log('Connected to DB')
    return pool;
})
.catch(error => {
    console.log('Error accured: ' + error);
});

module.exports = {
    sql, poolpromise
}