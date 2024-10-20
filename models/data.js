let users = [];
let coffees = [
  { id: 1, name: 'Espresso', price: 5 },
  { id: 2, name: 'Latte', price: 6 }
];
let carts = {}; // Cart per user
let orders = [];

module.exports = { users, coffees, carts, orders };
