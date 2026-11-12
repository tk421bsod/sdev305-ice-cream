import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

const app = express();
const port = 3000;
let orders = []

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.get('/', (req, res) => {res.sendFile(`${import.meta.dirname}/views/home.html`)});
app.post('/submit', async(req, res) => {
    let order = req.body;

    console.log(order); 
    order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";
    const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings, comment) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [order.name, order.email, order.flavor, order.cone, order.toppings, order.comments];
    const [result] = await pool.execute(sql, params);

    order.id = result.insertId;
    console.log('Order saved with ID: ', order.id);
    console.log(order);
    res.render('confirmation', { order });
});
app.get('/admin', async (req, res) => {
    try {
        const [orders] = await pool.query(`SELECT * FROM orders ORDER BY timestamp DESC`);
        res.render('admin', { orders });
    } catch (err) {
        console.log("Database error");
        console.log(err);
    }
}); 
app.listen(port, () => {console.log("Server is running")});