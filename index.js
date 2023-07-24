const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

let total_price = 0;

app.post('/', (req, res) => {
    const { name, prodId, price, amount } = req.body;
    
    db.query("SELECT * FROM products WHERE prodId = ?", [prodId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if(result[0].price != price){
                res.json({message: "Price has been changed, please try again"});
                return;
            } else if(result[0].stock < amount){
                res.json({message: "Not enough items in stock"});
                return;
            }
            total_price += result[0].price * amount;
            res.json({message: "Product added to cart", totalPrice: total_price});
        }
    })
  

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
