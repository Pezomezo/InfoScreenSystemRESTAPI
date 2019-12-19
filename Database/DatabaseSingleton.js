const sql = require('mssql');
//var config = {
//        server: `PC0175557`,  
//        database: "InfoScreenDB",
//        // If you're on Windows Azure, you will need this:
//        driver: "msnodesqlv8",
//        options: {
//          trustedConnection: true
//        }
//};

const config = {
  user: 'sa',
  password: 'Pezolino#98', //HorvathAdam98
  server: 'PC0175557', // You can use 'localhost\\instance' to connect to named instance DESKTOP-JQ5PF54\\ADAMKASERVER
  database: 'InfoScreenDB',
}
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