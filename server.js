const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = "iRB&3|}PkrLo)D2@3XM|`/T]3wj!d=A^:QdudXiV:*{trKl1D}Uy5%3Ne|4R8Gl" 

// process.env.JWT_SECRET

app.use(express.json());

let users = [];
let coffees = [
  { id: 1, name: 'Espresso', price: 2.99, description: 'Strong black coffee' },
  { id: 2, name: 'Latte', price: 3.99, description: 'Creamy latte with steamed milk.' },
];
let orders = [];
let carts = {};


const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token.' });
    req.user = decoded;
    next();
  });
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
  next();
};

app.post('/auth/register', (req, res) => {
  const { username, password, role } = req.body;
  const newUser = { username, password, role: role || 'user' };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully.' });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) return res.status(400).json({ message: 'Invalid username or password.' });
  
  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY);
  res.json({ token });
});

app.post('/auth/logout', (req, res) => {
  res.json({ message: 'User logged out.' });
});


app.get('/coffees', (req, res) => {
  res.json(coffees);
});

app.get('/coffees/:id', (req, res) => {
  const coffee = coffees.find(c => c.id === parseInt(req.params.id));
  if (!coffee) return res.status(404).json({ message: 'Coffee not found.' });
  res.json(coffee);
});


app.post('/admin/coffees', authenticate, authorizeAdmin, (req, res) => {
  const newCoffee = { id: coffees.length + 1, ...req.body };
  coffees.push(newCoffee);
  res.status(201).json(newCoffee);
});

app.put('/admin/coffees/:id', authenticate, authorizeAdmin, (req, res) => {
  const coffee = coffees.find(c => c.id === parseInt(req.params.id));
  if (!coffee) return res.status(404).json({ message: 'Coffee not found.' });

  Object.assign(coffee, req.body);
  res.json(coffee);
});

app.delete('/admin/coffees/:id', authenticate, authorizeAdmin, (req, res) => {
  const coffeeIndex = coffees.findIndex(c => c.id === parseInt(req.params.id));
  if (coffeeIndex === -1) return res.status(404).json({ message: 'Coffee not found.' });

  const deletedCoffee = coffees.splice(coffeeIndex, 1);
  res.json(deletedCoffee);
});


app.get('/cart', authenticate, (req, res) => {
  const userCart = carts[req.user.username] || [];
  res.json(userCart);
});

app.post('/cart/add', authenticate, (req, res) => {
  const { coffeeId } = req.body;
  const coffee = coffees.find(c => c.id === coffeeId);
  if (!coffee) return res.status(404).json({ message: 'Coffee not found.' });

  if (!carts[req.user.username]) carts[req.user.username] = [];
  carts[req.user.username].push(coffee);
  res.json({ message: 'Coffee added to cart.' });
});

app.post('/cart/remove', authenticate, (req, res) => {
  const { coffeeId } = req.body;
  const userCart = carts[req.user.username] || [];
  const coffeeIndex = userCart.findIndex(c => c.id === coffeeId);

  if (coffeeIndex === -1) return res.status(404).json({ message: 'Coffee not in cart.' });
  
  userCart.splice(coffeeIndex, 1);
  res.json({ message: 'Coffee removed from cart.' });
});

app.post('/cart/checkout', authenticate, (req, res) => {
  const userCart = carts[req.user.username] || [];
  orders.push({ username: req.user.username, items: userCart });
  carts[req.user.username] = [];
  res.json({ message: 'You have Checked out successful.' });
});

app.get('/orders', authenticate, (req, res) => {
  const userOrders = orders.filter(o => o.username === req.user.username);
  res.json(userOrders);
});

app.get('/orders/:id', authenticate, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id) && o.username === req.user.username);
  if (!order) return res.status(404).json({ message: 'Order not likely found.' });
  res.json(order);
});

app.get('/admin/orders', authenticate, authorizeAdmin, (req, res) => {
  res.json(orders);
});

app.put('/admin/orders/:id', authenticate, authorizeAdmin, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: 'Order not likely found.' });

 
  res.json({ message: 'Order updated.' });
});


app.post('/payments/initiate', (req, res) => {

  res.json({ message: 'Payment initiated.' });
});

app.post('/payments/verify', (req, res) => {
 
  res.json({ message: 'Payment verified.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
