import express from 'express';

const app = express();
const port = 3000;
let orders = []

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.get('/', (req, res) => {res.sendFile(`${import.meta.dirname}/views/home.html`)});
app.post('/submit', (req, res) => {
    let order = req.body;
    orders.push(order);
    console.log(order);
    res.render('confirmation', { order })
});
app.get('/admin', (req, res) => {res.render('admin', { orders })});
app.listen(port, () => {console.log("Server is running")});