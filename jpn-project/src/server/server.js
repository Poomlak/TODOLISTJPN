const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 5000;

//const ของ reset password นะอิอิ
const crypto = require("crypto");
const nodemailer = require("nodemailer");
//  https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "webapp.otp@gmail.com",
    pass: "gggzyhrrphsoapsn",
  },
});
// OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "jpn-project",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database..");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.get("/server/serverTest", (req, res) => {
  db.query("SELECT * FROM member_id", (err, results) => {
    // ใช้ชื่อ member_id ตามที่คุณได้ระบุ
    if (err) {
      console.error("Error fetching", err);
      return res.status(500).send("Error fetching");
    }

    res.status(200).json(results);
  });
});

app.post("/signup", async (req, res) => {
  const { fname, lname, birthday, email, tel, username, password } = req.body;

  if (
    !fname ||
    !lname ||
    !birthday ||
    !email ||
    !tel ||
    !username ||
    !password
  ) {
    return res.status(400).send("Missing required fields");
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO member_id (member_fname, member_lname, member_birthday, member_email, member_tel, member_username, member_password) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [fname, lname, birthday, email, tel, username, hashedPassword],
    (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.status(500).send("Error inserting member");
      }
      res.status(200).send("Member registered successfully");
    }
  );
});

const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // ควรเก็บ SECRET_KEY ไว้ใน environment variables

const authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // คาดหวังรูปแบบ "Bearer token"

  if (!token) return res.sendStatus(401); // ถ้าไม่มี token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // ถ้า token ไม่ถูกต้อง
    req.user = user; // เก็บข้อมูลผู้ใช้ไว้ใน req.user
    next();
  });
};

app.get("/user", authenticateToken, (req, res) => {
  // ใช้ req.user เพื่อเข้าถึงข้อมูลผู้ใช้
  res.json({ message: "Welcome, " + req.user.username });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }

  const query = "SELECT * FROM member_id WHERE member_username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = results[0];

    bcrypt.compare(password, user.member_password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error");
      }

      if (!isMatch) {
        return res.status(401).send("Invalid username or password");
      }

      // สร้าง JWT
      const token = jwt.sign(
        { id: user.id, username: user.member_username },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token }); // ส่งกลับ token
    });
  });
});

app.post("/checkUser", (req, res) => {
  const { username, email, tel } = req.body;

  const query =
    "SELECT * FROM member_id WHERE member_username = ? OR member_email = ? OR member_tel = ?";
  db.query(query, [username, email, tel], (err, results) => {
    if (err) {
      return res.status(500).send("Error checking user");
    }

    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

// Send OTP
app.post("/send-otp", (req, res) => {
  const { identifier } = req.body;

  const query =
    "SELECT member_email FROM member_id WHERE member_username = ? OR member_email = ?";
  db.query(query, [identifier, identifier], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).send("Username or email not found");
    }

    const email = result[0].member_email;
    const otp = generateOtp();

    // เก็บ OTP ในฐานข้อมูล (อาจจะต้องสร้างตารางใหม่เพื่อเก็บ OTP)
    const insertOtpQuery =
      "INSERT INTO otp_table (email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = ?";
    db.query(insertOtpQuery, [email, otp, otp], (err) => {
      if (err) {
        return res.status(500).send("Failed to save OTP");
      }

      // ส่งอีเมลพร้อม OTP
      transporter.sendMail({
        to: email,
        subject: "Your OTP Code for JPN-Todolist",
        text: `Your OTP code is ${otp} \nDont forget your password ;-; \nThank you`,
      });

      res.status(200).send("OTP sent");
    });
  });
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  const { otp, newPassword } = req.body;

  // ตรวจสอบ OTP
  const checkOtpQuery = "SELECT email FROM otp_table WHERE otp = ?";
  db.query(checkOtpQuery, [otp], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).send("Invalid OTP");
    }

    const email = result[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10); // เข้ารหัสรหัสผ่าน

    // อัพเดต password ใน DB
    const updatePasswordQuery =
      "UPDATE member_id SET member_password = ? WHERE member_email = ?";
    db.query(updatePasswordQuery, [hashedPassword, email], (err) => {
      if (err) {
        return res.status(500).send("Failed to reset password");
      }
      res.status(200).send("Password reset successful");
    });
  });
});

// Profile API
app.get("/api/profile/:username", (req, res) => {
  const username = req.params.username;

  const query = `
    SELECT member_id, member_fname, member_lname, member_birthday, member_email, member_tel, member_username, member_password, member_image_url 
    FROM member_id 
    WHERE member_username = ?
  `;

  db.query(query, [username], (error, results) => {
    if (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({
        member_id: user.member_id,
        member_fname: user.member_fname,
        member_lname: user.member_lname,
        member_birthday: user.member_birthday,
        member_email: user.member_email,
        member_tel: user.member_tel,
        member_username: user.member_username,
        member_password: user.member_password, // ส่งรหัสผ่านแบบปกติ
        member_image_url: user.member_image_url, // เพิ่ม URL ของรูปภาพ
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

app.put("/api/profile/:username", async (req, res) => {
  const username = req.params.username;
  const { password, birthday, email, telephone, imageUrl } = req.body;

  try {
    // ดึงข้อมูลผู้ใช้ปัจจุบันเพื่อตรวจสอบรหัสผ่าน
    db.query(
      "SELECT member_password FROM member_id WHERE member_username = ?",
      [username],
      async (error, results) => {
        if (error) {
          console.error("Error fetching profile:", error);
          return res.status(500).json({ message: "Server error" });
        }

        const currentPassword = results[0]?.member_password;

        // ถ้ามีการส่ง password ใหม่เข้ามา จะทำการ hash ถ้าไม่มีก็จะใช้ password เดิม
        const hashedPassword =
          password && password !== currentPassword
            ? await bcrypt.hash(password, 10)
            : currentPassword;

        const query = `
          UPDATE member_id 
          SET 
            member_birthday = ?, 
            member_email = ?, 
            member_tel = ?, 
            member_password = ?, 
            member_image_url = ?
          WHERE member_username = ?
        `;

        db.query(
          query,
          [birthday, email, telephone, hashedPassword, imageUrl, username],
          (error, results) => {
            if (error) {
              console.error("Error updating profile:", error);
              return res.status(500).json({ message: "Server error" });
            }
            res.status(200).json({ message: "Profile updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/send-update-email", (req, res) => {
  const { email, username, changes } = req.body;

  // สร้างเนื้อหาอีเมล
  const mailOptions = {
    from: "webapp.otp@gmail.com",
    to: email,
    subject: "Profile Update Notification",
    text: `Dear ${username},\n\nโปรไฟล์ของคุณได้มีการอัพเดท:\n\n` +
          `- Username: ${username}\n` +
          `- Birthday: ${changes.birthday}\n` +
          `- Telephone: ${changes.telephone}\n` +
          `- Profile Image URL: ${changes.imageUrl}\n\n` +
          "หากคุณไม่ได้แก้ไขด้วยตัวเองโปรดติดต่อทีมงาน.\n\nด้วยความเคารพ,\nJPN-Todolist",
  };

  // ส่งอีเมล
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Failed to send update email");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Update email sent successfully");
  });
});


app.get("/api/diary", (req, res) => {
  const sql = "SELECT diary_namebook, member_createdbook, member_lastupdatedbook FROM member_diary WHERE diary_username = ?";
  const username = "admin"; // Adjust as necessary

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }

    if (result.length > 0) {
      res.json(result); // Send all data
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลไดอารี" });
    }
  });
});

app.put("/api/diary/update-timestamp", (req, res) => {
  const sql = "UPDATE member_diary SET member_lastupdatedbook = NOW() WHERE diary_username = ?";
  const username = "admin"; // Adjust as necessary

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดต timestamp:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต timestamp" });
    }

    if (result.affectedRows > 0) {
      res.json({ message: "อัปเดต timestamp เรียบร้อย" });
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }
  });
});


app.post("/api/diary/create", (req, res) => {
  const { diaryName, username } = req.body;
  const sql = "INSERT INTO member_diary (diary_namebook, member_createdbook, member_lastupdatedbook, diary_username) VALUES (?, NOW(), NOW(), ?)";

  db.query(sql, [diaryName, username], (err, result) => {
    if (err) {
      console.error("Error creating diary:", err);
      return res.status(500).json({ message: "Error creating diary" });
    }
    res.status(201).json({ message: "Diary created successfully!" });
  });
});

app.put("/api/diary/update/:oldName", (req, res) => {
  const { newName } = req.body; // ดึงชื่อใหม่จาก request body
  const oldName = req.params.oldName;

  const sql = "UPDATE `member_diary` SET `diary_namebook` = ? WHERE `diary_namebook` = ? AND `diary_username` = ?";
  const username = "admin"; // หรือใช้ username จาก token หรือ session

  db.query(sql, [newName, oldName, username], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตชื่อ:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตชื่อ" });
    }

    if (result.affectedRows > 0) {
      res.json({ message: "อัปเดตชื่อเรียบร้อยแล้ว" });
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }
  });
});



app.delete("/api/diary/delete", (req, res) => {
  const { name, username } = req.body;
  const sql = "DELETE FROM `member_diary` WHERE `diary_namebook` = ? AND `diary_username` = ?";

  db.query(sql, [name, username], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }

    if (result.affectedRows > 0) {
      res.json({ message: "ลบสำเร็จ" });
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการลบ" });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(
    "Listening on port",
    "http://localhost:" + port,
    "ใส่ข้างหลังต่อด้วยดูว่าข้อมูลมีไหม"
  );
});
