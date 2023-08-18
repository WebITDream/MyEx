const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myex_global'
})

module.exports = connection

// DATABASE QUERY 
//
//
// CREATE TABLE `orders` (
//     `id` int(11) NOT NULL,
//     `payment` varchar(128) NOT NULL,
//     `address` varchar(256) NOT NULL,
//     `username` varchar(128) NOT NULL,
//     `email` varchar(128) NOT NULL,
//     `products` varchar(512) NOT NULL,
//     `delivered` varchar(64) NOT NULL DEFAULT 'false',
//     `order_id` varchar(128) NOT NULL,
//     `date` varchar(256) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
  
  
//   CREATE TABLE `products` (
//     `id` int(11) NOT NULL,
//     `prodId` varchar(128) NOT NULL,
//     `prodName` varchar(128) NOT NULL,
//     `price` int(11) NOT NULL,
//     `stock` int(128) NOT NULL DEFAULT 100,
//     `imgURL` varchar(512) NOT NULL,
//     `description` varchar(512) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
  
//   CREATE TABLE `users` (
//     `id` int(11) NOT NULL,
//     `username` varchar(128) NOT NULL,
//     `email` varchar(128) NOT NULL,
//     `password` varchar(512) NOT NULL,
//     `role` varchar(256) NOT NULL DEFAULT 'member'
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
//   ALTER TABLE `orders`
//     ADD PRIMARY KEY (`id`);
  
  
//   ALTER TABLE `products`
//     ADD PRIMARY KEY (`id`);
  
  
//   ALTER TABLE `users`
//     ADD PRIMARY KEY (`id`);
  
  
//   ALTER TABLE `orders`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
  
  
//   ALTER TABLE `products`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
  
  
//   ALTER TABLE `users`
//     MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
//   COMMIT;
  
  
