

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
                    '\x1b[33m Go back'
                ]
            }
        ])
        .then(user => {
            switch (user.budget) {
                case 'Entire company budget':
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
                break;

                case 'Budget by department':
                    budgetByDept()
                break;
                default:
                    startInit() 
            }
        })
}


budgetByDept = () => {
    const queryDeptRoles = `SELECT dept_name, department.id FROM department`
    connection.query(queryDeptRoles, (err, result) => {
        if (err) throw error;
        let resultArr = []
        result.forEach(e => resultArr.unshift(Object.values(e)))
        let newArr = []
        resultArr.sort().forEach(e => newArr.push(e[0]))
        newArr.push(new inquirer.Separator())
        newArr.push('\x1b[33m Go back')
    inquirer  
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m View budget by departments',
                name: 'dept',
                pageSize: 12,
                choices: 
                    [...newArr]
            }
        ]).then(user => {
            let finalArr = []
            resultArr.forEach(e => e[0] == user.dept ? finalArr.push(e) : '')
            const budgetDept = `SELECT SUM(roles.salary) As "Total" FROM employee
            INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department on 
            roles.department_id = department.id LEFT JOIN employee m on 
            employee.manager_id = m.id WHERE department.id = ${finalArr[0][1]}`

            connection.query(budgetDept, (err, result) => {
                if (err) throw err;
                    let total = []
                    total.push(Object.entries(result[0]))
                    console.log(`\x1b[35m Utilized budget for all departments: $` +Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(total[0][0][1]))
                    compBudg()
            })
        })
    })
}  




module.exports = compBudg