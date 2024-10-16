const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');

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
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

app.get('/server/serverTest', (req, res) => {
    db.query('SELECT * FROM member_id', (err, results) => { // ใช้ชื่อ member_id ตามที่คุณได้ระบุ
        if (err) {
            console.error('Error fetching', err); 
            return res.status(500).send('Error fetching');
        }
        
        res.status(200).json(results); 
    });
}); 

app.post('/signup', async (req, res) => {
    const { fname, lname, birthday, email, tel, username, password } = req.body;

    if (!fname || !lname || !birthday || !email || !tel || !username || !password) {
        return res.status(400).send('Missing required fields');
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO member_id (member_fname, member_lname, member_birthday, member_email, member_tel, member_username, member_password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    db.query(query, [fname, lname, birthday, email, tel, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('MySQL Error:', err); 
        return res.status(500).send('Error inserting member');
      }
      res.status(200).send('Member registered successfully');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    
    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    
    const query = 'SELECT * FROM member_id WHERE member_username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];

        
        bcrypt.compare(password, user.member_password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal server error');
            }

            if (!isMatch) {
                return res.status(401).send('Invalid username or password');
            }

            
            res.status(200).send('Login successful');
        });
    });
});








// Start the server
app.listen(port, () => {
    console.log('Listening on port', "http://localhost:" + port, "ใส่ข้างหลังต่อด้วยดูว่าข้อมูลมีไหม");
});
