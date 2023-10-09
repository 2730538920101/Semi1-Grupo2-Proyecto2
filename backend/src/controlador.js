const conn = require('./conexion');

function TestConnection(){
    conn.execute('SELECT NOW()', function(err, results, fields){
        console.log(results);
        console.log(fields);
    });
}

module.exports = {
    TestConnection
}