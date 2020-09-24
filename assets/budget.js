

const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()


compBudg = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'budget',
                message: 'What budget option would you like to view?',
                choices: 
                [   
                    new inquirer.Separator(),
                    'Entire company budget',
                    'Budget by department',
                    new inquirer.Separator(),
                    '\x1b[33m Exit'
                ]
            }
        ])
        .then(user => {
            const totalSum = `SELECT SUM(roles.salary) As "Total" FROM employee
            INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department
            on roles.department_id = department.id LEFT JOIN employee m
            on employee.manager_id = m.id` 
            
            connection.query(totalSum, (err, result) => {
                if (err) throw err;
                let total = []
                total.push(Object.entries(result[0]))
                console.log(`\x1b[35m Utilized budget for all departments: $` +Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(total[0][0][1]))
                compBudg()
            })




        })


}


module.exports = compBudg