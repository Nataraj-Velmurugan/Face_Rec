const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '5342',
    database: 'world',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(8000, () => console.log('Express server is runnig at port no : 8000'));


//Get all employees
app.post('/signin', (req, res) => {
    let data = req.body;
    mysqlConnection.query(`SELECT * FROM REGISTER WHERE Email = '${data.Email}' AND Password = '${data.Password}'`, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
            res.send(err);
    })
});

//Insert an employees
app.post('/register', (req, res) => {
    let data = req.body;
    var sql = `INSERT INTO REGISTER VALUES ('${data.Name}', '${data.Email}', '${data.Password}');`
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
                res.send(rows);
        }  
        else {
            console.log(err);
            res.send(err);
        }
            
    })
});


