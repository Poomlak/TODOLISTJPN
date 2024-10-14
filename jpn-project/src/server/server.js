const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); 

const app = express();
const port = process.env.PORT || 5000; 


const db = mysql.createConnection({
    host: '26.11.35.119',   
    user: 'root',           
    password: 'root',       
    database: 'jpn-project',
    port: 3306             
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database..');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});


app.get('/server/serverTest', (req, res) => {
    db.query('SELECT * FROM member_id', (err, results) => {
        console.log(results);
        if (err) {
            console.error('Error fetching', err); 
            return res.status(500).send('Error fetching');
        }
        
        res.send(results); 
    });
}); 

// Start the server
app.listen(port, () => {
    console.log('Listening on port', "http://localhost:"+port ,"ใส่ข้างหลังต่อด้วยดูว่าข้อมูลมีไหม");
});
