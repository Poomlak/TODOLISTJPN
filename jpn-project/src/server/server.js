const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 5000; 

//const ของ reset password นะอิอิ
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
//  https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'webapp.otp@gmail.com',
      pass: 'gggzyhrrphsoapsn'
    }
  });
  // OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
  };

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
app.post('/checkUser', (req, res) => {
    const { username, email, tel } = req.body;

    const query = 'SELECT * FROM member_id WHERE member_username = ? OR member_email = ? OR member_tel = ?';
    db.query(query, [username, email, tel], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking user');
        }

        if (results.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
});


// Send OTP
app.post('/send-otp', (req, res) => {
    const { identifier } = req.body;
  
    const query = "SELECT member_email FROM member_id WHERE member_username = ? OR member_email = ?";
    db.query(query, [identifier, identifier], (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).send('Username or email not found');
      }
  
      const email = result[0].member_email;
      const otp = generateOtp();
  
      // เก็บ OTP ในฐานข้อมูล (อาจจะต้องสร้างตารางใหม่เพื่อเก็บ OTP) 
      const insertOtpQuery = "INSERT INTO otp_table (email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = ?";
      db.query(insertOtpQuery, [email, otp, otp], (err) => {
        if (err) {
          return res.status(500).send('Failed to save OTP');
        }
  
        // ส่งอีเมลพร้อม OTP
        transporter.sendMail({
          to: email,
          subject: 'Your OTP Code',
          text: `Your OTP code is ${otp}`
        });
  
        res.status(200).send('OTP sent');
      });
    });
  });
  
  // Reset Password
  app.post('/reset-password', async (req, res) => {
    const { otp, newPassword } = req.body;
  
    // ตรวจสอบ OTP
    const checkOtpQuery = "SELECT email FROM otp_table WHERE otp = ?";
    db.query(checkOtpQuery, [otp], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).send('Invalid OTP');
      }
  
      const email = result[0].email;
      const hashedPassword = await bcrypt.hash(newPassword, 10); // เข้ารหัสรหัสผ่าน
  
      // อัพเดต password ใน DB
      const updatePasswordQuery = "UPDATE member_id SET member_password = ? WHERE member_email = ?";
      db.query(updatePasswordQuery, [hashedPassword, email], (err) => {
        if (err) {
          return res.status(500).send('Failed to reset password');
        }
        res.status(200).send('Password reset successful');
      });
    });
  });
  




// Start the server
app.listen(port, () => {
    console.log('Listening on port', "http://localhost:" + port, "ใส่ข้างหลังต่อด้วยดูว่าข้อมูลมีไหม");
});
