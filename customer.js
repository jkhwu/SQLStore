// package requires
var cmd = require('node-cmd');
var mysql = require('mysql');
var inquirer = require('inquirer');

// seed product inventory
cmd.run('mysql -u root < inventory.sql');

// // constructor function used to create purchase objects
// function Purchase(itemId, qty) {
//     this.itemId = itemId;
//     this.qty = qty;
//     // gets price from database
//     this.price = function() {
//         return '$100';
//     };
//     // checks if item is in stock; returns boolean value
//     this.isAvailable = function() {
//         return true;
//     };
//     // checks total cost
//     this.totalCost = function() {
//         return this.price() * this.qty;
//     };
//     // decrements stock quantity in database
//     this.decrement = function() {
//         return '--'
//     };

//     // creates the printInfo method and applies it to all programmer objects
//     this.printInfo = function() {
//         console.log("Item ID: " + this.itemId + "\nPurchase Quantity: " + this.qty +
//             "\nPrice: " + this.price() + "\nStock Quantity: " + this.stockQty() +
//             "\nAvailable: " + this.isAvailable() + "\nTotal Cost: " + this.totalCost());
//     };
// }

// // runs inquirer and asks the user a series of questions whose replies are
// // stored within the variable answers inside of the .then statement
// inquirer.prompt([{
//     name: "itemIdAnswer",
//     message: "Welcome to the Wizard Emporium. Enter the ID of the item you'd like to buy:"
// }, {
//     name: "qtyAnswer",
//     message: "How many units would you like?"
// }]).then(function(answers) {
//     // initializes the variable newOrder to be a programmer object which will take
//     // in all of the user's answers to the questions above
//     var newOrder = new Purchase(
//         answers.itemIdAnswer,
//         answers.qtyAnswer
//     );
//     // printInfo method is run to show that the newguy object was successfully created and filled
//     newOrder.printInfo();
// });