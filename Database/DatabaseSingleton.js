const sql = require('mssql');

var config = {
        server: "info-screen-server.database.windows.net",
        database: "infoScrennDB",
        // If you're on Windows Azure, you will need this:
        options: {encrypt: true},
        authentication: {
          type: "default",
          options: {  
            userName: "Adamka",
            password: "HorvathAdam98",
          }
        }
};
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