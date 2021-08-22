const util = require('util');
const mysql = require('mysql');
const express = require('express');
const fs = require('fs').promises;
var app = express();
var multer = require('multer');
const formData = require("express-form-data");
var cors = require('cors');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json())

let dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Mohanraj@95',
    database: 'FaceRecognition',
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
    destination: function (req, file, cb) {
      cb(null, './images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });

  const fileFilter=(req, file, cb)=>{
   if (file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png') {
       cb(null,true);
   } 
   else {
       cb(null, false);
   }
  }

var upload = multer({ 
    storage: storage,
    fileFilter:fileFilter
 });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    next();
});

app.post('/login', async (req, res) => {
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

app.post('/', function(req, res){
   console.log(req.body);
   res.send("recieved your request!");
});


app.post('/register', upload.single('image'), async (req, res) => {

    console.log(req.body.name + "  ---- "  +req.body.email + "  ---- " + req.body.password);

    console.log('Inside register request');

    //console.log(req.body.image);
    let data = req.body;

    var base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
    
    var fileName = req.body.name.split(' ').join('');

    await fs.writeFile('./images/' + fileName +'.jpeg', base64Data, 'base64');
    var sql = `INSERT INTO REGISTER VALUES ('${data.name}', '${data.email}', '${data.password}', '${fileName}', 0, 0);`
    const userData = await db.query(sql);
    res.send(userData);


    // fs.writeFile('./images/' + fileName +'.jpeg', base64Data, 'base64', (err) => {
    //     if (err){
    //         throw err
    //         //res.send("Error in file uploads");
    //     }
    //     else {
    //         // /res.status(200).send('success');
    //         var sql = `INSERT INTO REGISTER VALUES ('${data.name}', '${data.email}', '${data.password}', '${fileName}', 0, 0);`
    //         const userData = await db.query(sql);
    //         res.send(userData)
    //     }
    // }) 
});
