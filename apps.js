const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const eView = require('./assets/view')
const addOpt = require('./assets/add')
const updateOpt = require('./assets/update')
const delEmp = require('./assets/delete')
const figlet = require('figlet')
const compBudg = require('./assets/budget')


startInit = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m Please choice your option',
                name: 'option',
                pageSize: 12,
                choices: [
                    new inquirer.Separator(),
                    'View Menu',
                    'Add Menu',
                    'Update Employee',
                    'Remove Menu',
                    'Company Budget',
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
                    addOpt()
                    break;
                case 'Update Employee':
                    updateOpt()
                    break;
                case 'Remove Menu':
                    delEmp()
                    break;  
                case 'Company Budget':
                    compBudg()
                    break;
                default:
                    console.log(`\x1b[35m Exit complete.`)
                    process.exit()             
            }
        })
}

figlet.text('Employee Manager' , {
    font: 'standard',
} , function(err, data) {
    if (err) throw err;
    console.log(data)
    console.log('\n')
    startInit()
})
