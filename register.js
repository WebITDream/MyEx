const express = require('express');
const db = require('./db')
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/register', (req, res) => {
    // Render your registration HTML page here
    res.sendFile(__dirname + '/public/register.html');
});

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.log(err);
        }else if(result.length > 0){
            res.json({ success: false, message: "Email already exists" });
        }else{
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                }else{
                    db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash], (err, result) => {
                        if (err) {
                            console.log(err);
                        }else{
                            res.json({ success: true, message: "Registration successful" });
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;