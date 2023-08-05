const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const registerPage = require('./register.js');
const loginPage = require('./login.js');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(
    session({
        secret: 'Daniel03',
        resave: true,
        saveUninitialized: false
    })
)
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

/////////////////// Routes ///////////////////
// Register
app.use('/', registerPage);
// Login
app.use('/', loginPage);
app.use(express.static('public'));

let total_price = 0;
let cart = [];

function hasPlacedOrder(req, res, next) {
    if (req.session.hasPlacedOrder) {
        next();
    } else {
        res.redirect('/');
    }
}

function generateRandomOrderId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Assuming you're using Express.js on the server-side
app.get('/check-session', (req, res) => {
    if (req.session.loggedin) {
        res.json({ sessionActive: true, sessionId: req.session.id });
    } else {
        res.json({ sessionActive: false });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
})

app.post('/', (req, res) => {
    const { name, prodId, price, amount } = req.body;


    db.query("SELECT * FROM products WHERE prodId = ?", [prodId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0].price != price) {
                res.json({ message: "Price has been changed, please try again" });
                return;
            } else if (result[0].stock < amount) {
                res.json({ message: "Not enough items in stock" });
                return;
            }
            
            if (!req.session.cart) {
                req.session.cart = [];
            }
            
            const total_price = result[0].price * amount;
            req.session.cart.push({ name, amount, total_price });
            
            res.json({ message: "Product added to cart", totalPrice: total_price });
        }
    });
});


app.post('/finish-order', (req, res) => {
    let payment = req.body.paymentMethod;
    let address = req.body.address;
    let username = req.body.username;
    let email = req.body.email;

    // Retrieve cart from the session
    const cart = req.session.cart;

    if (!payment || !address || !username || !email || !cart || cart.length === 0) {
        res.json({ message: "Please fill in all fields or add products to the cart" });
        return;
    }

    // Stringify the cart to store in the database
    const cartJsonString = JSON.stringify(cart);

    const order_id = generateRandomOrderId(10); // You can adjust the length as needed

    db.query("INSERT INTO orders (username, email, address, payment, products, order_id) VALUES (?, ?, ?, ?, ?, ?)", [username, email, address, payment, cartJsonString, order_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // Store the order_id in the session
            req.session.order_id = order_id;

            // Clear cart and total_price for the user after order is completed
            req.session.cart = [];
            total_price = 0;

            // send a response to the client to html
            req.session.hasPlacedOrder = true;
            res.redirect('/final');
        }
    });
});

app.get('/final', hasPlacedOrder, (req, res) => {
    // Display the order_id for the user
    const order_id = req.session.order_id;
    res.send(`Order completed<br> Order ID: ${order_id}`);
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
