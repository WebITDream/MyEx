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

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.log(err);
        }else if(result.length == 0){
            res.json({ success: false, message: "Email does not exist" });
        }else{
            const role = result[0].role;
            const username = result[0].username;
            bcrypt.compare(password, result[0].password, (err, result) => {
                if (err) {
                    console.log(err);
                }else if(result == true){
                    req.session.id = generateHash(password)
                    req.session.username = username;
                    req.session.email = email;
                    req.session.loggedin = true;
                    req.session.role = role;
                    res.redirect('/?session=' + req.session.id)
                }else{
                    res.json({ success: false, message: "Wrong email or password" });
                }
            })
        }
    })
    
})

module.exports = router;
