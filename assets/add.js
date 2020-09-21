const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()

addOpt = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m Add Menu',
                name: 'add',
                choices: [
                    new inquirer.Separator(),
                    'Add Employee',
                    'Add Role',
                    'Add Department',
                    new inquirer.Separator(),
                    '\x1b[33m Go back'
                ]
            }
        ])
        .then(user =>{
            switch (user.add) {
                case 'Add Employee':
                    addEmployee();
                break;
                case 'Add Role':
                    addRole();   
                break;
                case 'Add Department':
                    addDept();
                break;
            default:
                startInit();
            }
        })
}




module.exports = addOpt