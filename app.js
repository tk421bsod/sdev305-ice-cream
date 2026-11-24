import express from 'express';
import session from 'express-session';
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
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 1000*60*60}}));
app.use(express.static('public'));

function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', (req, res) => {res.sendFile(`${import.meta.dirname}/views/home.html`)});
app.get('/login', (req, res) => {
    let error = "";
    res.render('login', { error })
})
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error : 'Invalid username or password.'});
    }
})
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {res.redirect('/login');});
})
app.post('/submit', async(req, res) => {
    let order = req.body;

    order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";
    const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings, comment) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [order.name, order.email, order.flavor, order.cone, order.toppings, order.comments];
    const [result] = await pool.execute(sql, params);

    order.id = result.insertId;
    res.render('confirmation', { order });
});
app.get('/admin', requireLogin, async (req, res) => {
    try {
        const [orders] = await pool.query(`SELECT * FROM orders ORDER BY timestamp DESC`);
        res.render('admin', { orders });
    } catch (err) {
        res.status(500).send("<h1>Sorry, your order couldn't be placed.</h1><p>Please try again later.</p>")
    }
}); 
app.listen(port, () => {console.log("Server is running")});