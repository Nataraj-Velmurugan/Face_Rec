const util = require('util');
const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
var multer = require('multer');
const formData = require("express-form-data");

app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: true })); 

// app.use(formData.format());

let dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '5342',
    database: 'world',
    multipleStatements: true
}

function makeDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}

const db = makeDb(dbConfig);


app.listen(8000, () => console.log('Express server is runnig at port no : 8000'));

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('photo');


app.post('/signin', async (req, res) => {
    let data = req.body;
    try {
        const userData = await db.query(`SELECT * FROM REGISTER WHERE Email = '${data.Email}'`);

        console.log(userData)

        if (data.type === "face") {
            let updatefaceCount = userData[0].face_count + 1
            const saveFaceCount = await db.query(`UPDATE REGISTER SET face_count = ${updatefaceCount} WHERE EMAIL = '${userData[0].Email}'`);
            res.send(saveFaceCount)
        } else {
            let updatePassCount = userData[0].password_count + 1
            const savePassCount = await db.query(`UPDATE REGISTER SET password_count = ${updatePassCount} WHERE EMAIL = '${userData[0].Email}'`);
            res.send(savePassCount)
        }
    } catch (err) {
        res.send(err)
    } 

});


app.post('/register', async (req, res) => {

    upload(req, res, async (err) => {
        let data = req.body;

        console.log(data)
        console.log(req.file)
        if (err) {
            console.log(err)
            console.log("Error uploading file.");
        } else {
            console.log("File is uploaded successfully!");

            var sql = `INSERT INTO REGISTER VALUES ('${data.Name}', '${data.Email}', '${data.Password}', '${req.file.originalname}', 0, 0);`
            const userData = await db.query(sql);
            // await db.close();
            res.send(userData)
        }
    });
});


