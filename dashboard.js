const express = require('express');
const db = require('./db')
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const router = express.Router();


router.use(
    session({
        secret: 'Daniel03',
        resave: false,
        saveUninitialized: true
    })
)
router.use(bodyParser.urlencoded({ extended: false }));

function checkConnection(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/check-orders', checkConnection, (req, res) => {
    db.query("SELECT * FROM orders WHERE username = ?", [req.session.username], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ success: false, message: "Error occurred while fetching orders" });
        } else {
            if (result.length === 0) {
                res.json({ success: false, message: "No orders found" });
            } else {
                let orders = result.map(order => ({
                    products: order.products,
                    orderId: order.order_id,
                    username: order.username,
                    payment: order.payment,
                    address: order.address,
                    date: order.date
                }));
                res.json({ success: true, orders: orders });
            }
        }
    });
});

router.post('/cancel-order', (req, res) => {
    let order_id = req.body.orderId;
    db.query("DELETE FROM orders WHERE order_id = ?", [order_id], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: "Error occurred while cancelling order" });
        } else {
            console.log("order " + order_id + " cancelled")
            res.json({ message: "Order cancelled" });
        }
    });
});

module.exports = router;
