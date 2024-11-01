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
  host: "26.11.35.119",
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
  console.log(req.body.username);
  const lowercaseusername = username.toLowerCase();
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
    [fname, lname, birthday, email, tel, lowercaseusername, hashedPassword],
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

    // ดึงรหัสผ่านเก่าจากฐานข้อมูล
    const getOldPasswordQuery =
      "SELECT member_password FROM member_id WHERE member_email = ?";
    db.query(getOldPasswordQuery, [email], async (err, userResult) => {
      if (err || userResult.length === 0) {
        return res.status(404).send("User not found");
      }

      const oldPassword = userResult[0].member_password;

      // ตรวจสอบว่ารหัสผ่านใหม่ไม่เหมือนกับรหัสผ่านเก่า
      const isSamePassword = await bcrypt.compare(newPassword, oldPassword);
      if (isSamePassword) {
        return res
          .status(400)
          .send("New password must not be the same as the old password");
      }

      // เข้ารหัสรหัสผ่านใหม่
      const hashedPassword = await bcrypt.hash(newPassword, 10);

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
    text:
      `Dear ${username},\n\nโปรไฟล์ของคุณได้มีการอัพเดท:\n\n` +
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

app.get("/api/userDiary", (req, res) => {
  const username = req.query.username; // รับ username จาก query
  const diaryName = req.query.diaryName; // รับ diary_namebook จาก query
  console.log(username, diaryName);
  const sql =
    "SELECT diary_namebook, member_createdbook, member_lastupdatedbook FROM member_diary WHERE diary_username = ? AND diary_namebook = ?";

  db.query(sql, [username, diaryName], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }

    if (result.length > 0) {
      res.json(result[0]); // ส่งข้อมูล object แรก
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลไดอารี" });
    }
  });
});

app.put("/api/diary/update-timestamp", (req, res) => {
  const diary_namebook = req.body.data.diary_namebook;
  const diary_Username = req.body.data.diary_username;
  console.log("data from frontend", req.body);
  // console.log("namebook",diary_namebook);
  // console.log("username",diary_Username);

  const sql =
    "UPDATE member_diary SET member_lastupdatedbook = NOW() WHERE diary_namebook = ? AND diary_username =?"; // อัปเดต timestamp ปัจจุบัน

  db.query(sql, [diary_namebook, diary_Username], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดต timestamp:", err);
      return res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการอัปเดต timestamp" });
    }

    if (result.affectedRows > 0) {
      res.json({ member_lastupdatedbook: new Date() }); // ส่งข้อมูล timestamp กลับไป
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }
  });
});

app.post("/api/diary/create", (req, res) => {
  const { diaryName, username,member_createdbook,member_lastupdatedbook} = req.body;
  console.log(req.body)
  // SQL query to check for existing diary with the same username and name
  const checkSql =
    "SELECT * FROM member_diary WHERE diary_namebook = ? AND diary_username = ?";
  db.query(checkSql, [diaryName, username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking for duplicate diary:", checkErr);
      return res
        .status(500)
        .json({ message: "Error checking for duplicate diary" });
    }

    if (checkResult.length > 0) {
      // If a matching diary is found, send an error response
      return res
        .status(400)
        .json({
          message: "Diary with the same name already exists for this user",
        });
    }

    // Proceed with insertion if no duplicate is found
    const insertSql =
      "INSERT INTO member_diary (diary_namebook, diary_username, member_createdbook, member_lastupdatedbook) VALUES (?,?, ?, ?)";

    db.query(insertSql, [diaryName, username,member_createdbook,member_lastupdatedbook], (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error creating diary:", insertErr);
        return res.status(500).json({ message: "Error creating diary" });
      }
      res.status(201).json({ message: "Diary created successfully!" });
    });
  });
});

app.put("/api/diary/update/:oldName", (req, res) => {
  const { newName, username } = req.body;
  const oldName = req.params.oldName;

  if (!newName || !username) {
    return res.status(400).json({ message: "กรุณาส่งชื่อใหม่และชื่อผู้ใช้" });
  }

  // Check if a diary with the new name already exists for the user
  const checkSql =
    "SELECT * FROM member_diary WHERE diary_namebook = ? AND diary_username = ?";
  db.query(checkSql, [newName, username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking for duplicate name:", checkErr);
      return res
        .status(500)
        .json({ message: "Error checking for duplicate name" });
    }

    if (checkResult.length > 0) {
      // If a diary with the new name already exists, return an error
      return res.status(400).json({ message: "ชื่อสมุดรายการนี้มีอยู่แล้ว" });
    }

    // Proceed with update if no duplicate is found
    const updateSql =
      "UPDATE `member_diary` SET `diary_namebook` = ? WHERE `diary_namebook` = ? AND `diary_username` = ?";
    db.query(updateSql, [newName, oldName, username], (updateErr, result) => {
      if (updateErr) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตชื่อ:", updateErr);
        return res
          .status(500)
          .json({ message: "เกิดข้อผิดพลาดในการอัปเดตชื่อ" });
      }

      if (result.affectedRows > 0) {
        res.json({ message: "อัปเดตชื่อเรียบร้อยแล้ว" });
      } else {
        res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
      }
    });
  });
});

app.delete("/api/diary/delete", (req, res) => {
  const { name, username } = req.body;

  // สร้าง query สำหรับลบจาก member_diary และ diary_list
  const sql1 =
    "DELETE FROM `member_diary` WHERE `diary_namebook` = ? AND `diary_username` = ?";
  const sql2 = "DELETE FROM `diary_list` WHERE `diary_namebook` = ?";

  // เริ่มต้น transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Error starting transaction" });
    }

    // ลบจาก member_diary
    db.query(sql1, [name, username], (err, result1) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Error deleting from member_diary" });
        });
      }

      // ลบจาก diary_list
      db.query(sql2, [name], (err, result2) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Error deleting from diary_list" });
          });
        }

        // Commit transaction หลังจากที่ลบสำเร็จจากทั้งสองตาราง
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: "Error committing transaction" });
            });
          }

          // ถ้าลบสำเร็จทั้งสองตาราง
          res.json({ message: "ลบสำเร็จจากทั้งสองตาราง" });
        });
      });
    });
  });
});

app.get("/api/diary", (req, res) => {
  const diaryName = req.query.diaryName; // ดึง diaryName จาก query
  const username = req.query.username; // ดึง username จาก query
  console.log( diaryName,username);

  // ตรวจสอบว่า username มีค่าหรือไม่
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  db.query(
    "SELECT * FROM diary_list WHERE diary_namebook = ? AND diary_username = ?",
    [diaryName, username], // ใช้ username ในการค้นหา
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error fetching diary", error: err });
      }
      if (results.length > 0) {
        res.json(results); // ส่งข้อมูลไดอารี
      } else {
        res.status(404).json({ message: "Diary not found" });
      }
    }
  );
});


app.get("/api/diary/:username", (req, res) => {
  const { token } = req.body; // ดึง token จาก request body
  const username = req.params.username; // รับ username จาก URL

  const sql =
    "SELECT diary_namebook, member_createdbook, member_lastupdatedbook FROM member_diary WHERE diary_username = ?";

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลไดอารี" });
    }
  });
});

app.put("/api/diarylist/update", (req, res) => {
  const {
    diary_id,
    diary_todoTopic,
    diary_todo,
    diary_reminder,
    diary_color,
    diary_textColor,
  } = req.body;

  // ตรวจสอบการรับค่าใน console.log

  const sql =
    "UPDATE diary_list SET diary_todoTopic = ?, diary_todo = ?, diary_reminder = ?, diary_color = ? ,diary_textColor = ? WHERE diary_id = ?";

  // ตรวจสอบการส่งพารามิเตอร์ให้ถูกต้อง
  db.query(
    sql,
    [
      diary_todoTopic,
      diary_todo,
      diary_reminder,
      diary_color,
      diary_textColor,
      diary_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating diary:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Diary updated successfully" });
      } else {
        return res.status(404).json({ message: "Diary not found" });
      }
    }
  );
});

app.delete("/api/diarylist/delete", (req, res) => {
  const { diary_id, diary_namebook, diary_todoTopic } = req.body;

  console.log("Received delete request with:", {
    diary_id,
    diary_namebook,
    diary_todoTopic,
  });

  // Query to delete diary based on multiple conditions
  const sql =
    "DELETE FROM diary_list WHERE diary_id = ? AND diary_namebook = ? AND diary_todoTopic = ?";
  db.query(sql, [diary_id, diary_namebook, diary_todoTopic], (err, result) => {
    if (err) {
      console.error("Error deleting diary:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    console.log("Delete query result:", result); // Log the result from the query

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Diary deleted successfully" });
    } else {
      console.log("Diary not found for given criteria."); // Log if nothing was found
      res.status(404).json({ message: "Diary not found" });
    }
  });
});

app.post("/api/diarylist/add", async (req, res) => {
  const {
    diary_todoTopic,
    diary_todo,
    diary_color,
    diary_reminder,
    diary_namebook,
    diary_created,
    diary_textColor,
    email,
    diary_username,
  } = req.body;

  // ตรวจสอบว่ามีค่าที่จำเป็นทั้งหมด
  if (
    !diary_todoTopic ||
    !diary_todo ||
    !diary_color ||
    !diary_reminder ||
    !diary_namebook ||
    !diary_created ||
    !diary_textColor ||
    !diary_username // Ensure diary_username is also checked
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const sql = `INSERT INTO diary_list (
    diary_todoTopic, 
    diary_todo, 
    diary_color, 
    diary_reminder, 
    diary_namebook, 
    diary_created,
    diary_textColor,
    diary_username
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    diary_todoTopic,
    diary_todo,
    diary_color,
    diary_reminder,
    diary_namebook,
    diary_created,
    diary_textColor,
    diary_username, // ค่าทั้งหมด 8 ค่า
  ];

  try {
    // เพิ่มข้อมูลเข้าไปในฐานข้อมูล
    const result = await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    // ส่ง response ทันทีหลังจากสร้าง Task เสร็จ
    res.status(201).json({
      message: "Task created successfully, and email will be sent!",
      taskId: result.insertId,
    });

    // ถ้างานถูกสร้างสำเร็จ ลองส่งอีเมลแจ้งเตือน
    const mailOptions = {
      from: "webapp.otp@gmail.com",
      to: email, // กำหนดที่อยู่อีเมลผู้รับ
      subject: "New Task Created",
      text: `A new task has been created with the following details:
      - Topic: ${diary_todoTopic}
      - Details: ${diary_todo}
      - Reminder: ${diary_reminder}
      - Created: ${diary_created}`,
    };

    // ส่งอีเมลใน background
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

  } catch (err) {
    console.error("Error adding task or sending email:", err);
    return res.status(500).json({ message: "Failed to add task or send email." });
  }
});




app.post("/api/getEmailByUsername", (req, res) => {
  const { member_username } = req.body;

  if (!member_username) {
    return res.status(400).json({ message: "Missing member_username" });
  }

  const sql = "SELECT member_email FROM member_id WHERE member_username = ?";
  db.query(sql, [member_username], (err, result) => {
    if (err) {
      console.error("Error fetching email:", err);
      return res.status(500).json({ message: "Error fetching email." });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const email = result[0].member_email;
    return res.status(200).json({ email });
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
