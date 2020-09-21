const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()
const cTable = require('console.table')


eView = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m View Menu',
                name: 'view',
                loop: false,
                choices: [
                    new inquirer.Separator(),
                    'All employees',
                    'Managers',
                    'Non-Managers',
                    'Roles',
                    'Departments',
                    new inquirer.Separator(),
                    '\x1b[33m Go back'
                ]
            }
        ])
        .then(user => {
            switch (user.view) {
                case "All employees":
                        
                
                    connection.query('SELECT * FROM employee', (err, result) => {
                    if (err) throw error;
                    console.log(result)
                    })






            }
        })









}

  

module.exports = eView


