// *** SETUP ***

// package requires
var cmd = require('node-cmd');
var mysql = require('mysql');
var inquirer = require('inquirer');

// set database connection
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'store_db'
});

// *** FUNCTIONS ***

function start() {
    // query the database for item data
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // prompt the user for which item they want to buy
        inquirer
            .prompt([{
                    name: "choice",
                    type: "list",
                    choices: function() {
                        var choiceArray = [];
                        results.map(x => {
                            let spaceCount = 59 - x.product_name.length - x.item_id.toString().length;
                            let spaces = '';
                            for (let i = 0; i < spaceCount; i++) {
                                spaces += ' ';
                            }
                            choiceArray.push(`${x.item_id}) ${x.product_name} ${spaces} |  ${x.price} Galleons`);
                        });
                        return choiceArray;
                    },
                    message: "Welcome to the Wizard Emporium. What would you like to buy?"
                },
                {
                    name: "qty",
                    type: "input",
                    message: "How many would you like to buy?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function(answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (answer.choice.includes(results[i].product_name)) {
                        chosenItem = results[i];
                    }
                }

                // determine if item is available
                if (chosenItem.stock_quantity >= parseInt(answer.qty)) {
                    // if we have enough stock, let the user know, and start over
                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: chosenItem.stock_quantity - parseInt(answer.qty)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            let total = parseInt(answer.qty) * chosenItem.price;
                            console.log(`That'll be ${total} Galleons total.`);
                            askAgain();
                        }
                    );
                } else {
                    if (chosenItem.stock_quantity == 0) {
                        console.log(`We're all out of ${chosenItem.product_name}, sorry.`);
                    } else {
                        console.log(`We only have ${chosenItem.stock_quantity} in stock right now, sorry.`);
                    }
                    askAgain();
                }
            });
    });
}

function askAgain() {
    inquirer
        .prompt([{
            name: "again",
            type: "list",
            choices: ['Yes', 'No'],
            message: "Would you like to buy anything else?"
        }])
        .then(function(answer) {
            if (answer.again == 'Yes') {
                start(); // restart
            } else {
                console.log('Thanks, see you next time.')
                connection.end(); // disconnect from database
            }
        });
}

// *** CALLS ***

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // seed product data
    cmd.run('mysql -u root < inventory.sql');
    // run the start function after the connection is made to prompt the user
    start();
});