const express = require('express');
const db = require('./db')
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { route } = require('./register');
const router = express.Router();


router.use(
    session({
        secret: 'Daniel03',
        resave: false,
        saveUninitialized: true
    })
)
router.use(bodyParser.urlencoded({ extended: false }));

//  de facut cand esti logat sa ai buton de logout + sa-ti apara username-ul in navbar etc
  
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.log(err);
        }else if(result.length == 0){
            res.json({ success: false, message: "Email does not exist" });
        }else{
            bcrypt.compare(password, result[0].password, (err, result) => {
                if (err) {
                    console.log(err);
                }else if(result == true){
                    req.session.email = email;
                    req.session.loggedin = true;
                    res.json({ success: true, message: "Login successful" });
                }else{
                    res.json({ success: false, message: "Wrong email or password" });
                }
            })
        }
    })
    
})

module.exports = router;