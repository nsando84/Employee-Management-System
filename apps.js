const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const eView = require('./assets/view')

startInit = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m Please choice your option',
                name: 'option',
                choices: [
                    new inquirer.Separator(),
                    'View Menu',
                    'Add Menu',
                    'Update Menu',
                    'Delete Menu',
                    new inquirer.Separator(),
                    '\x1b[33m Exit'
                ]
            }
        ])
        .then(user => {
            switch (user.option) {
                case 'View Menu':
                    eView()
                    break;
                case 'Add Menu':
                    // addEmp()
                    console.log("Add Employee screen.......")
                    break;
                case 'Update Menu':
                    // upEmp()
                     console.log("Update Employee screen..........")
                    break;
                case 'Delete Menu':
                    // delEmp()
                    console.log("Delete Employee screen..........")
                    break;  
                default:
                    console.log("exit......")
                    process.exit()             
            }
        })
}

startInit()

// module.exports = connection