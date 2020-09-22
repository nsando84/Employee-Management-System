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


addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter first name:',
                name: 'firstName'
            }
        ])
        .then(userFirst => {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: `Enter last name:`,
                            name: 'lastName'
                        }
                    ])
        .then(userLast => {
                
                const queryJobRoles = `SELECT roles.title, roles.id, manager_id, department.dept_name
                FROM roles INNER JOIN department on roles.department_id = department.id`
                connection.query(queryJobRoles, (err, result) => {
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
                            message: '\x1b[34m View employees by role',
                            name: 'role',
                            pageSize: 12,
                            choices: 
                            [...newArr]
                        }
                        ])
        .then(job => {
            let jobRole = resultArr.filter(e => job.role == e[0])
            
            if (jobRole[0][2] == null) {
                const queryPickManager = `SELECT employee.id, CONCAT (employee.first_name, " ", employee.last_name) As Manager
                FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department on roles.department_id
                = department.id LEFT JOIN employee m on employee.manager_id = m.id WHERE roles.manager_id <> " " AND
                department.dept_name = "${jobRole[0][3]}"`
                connection.query(queryPickManager, (err, result) => {
                    if (err) throw err;
                    let resultArr = []
                    result.forEach(e => resultArr.push(e))
                    let newArr = []
                    resultArr.forEach(e => newArr.push(e.Manager))
                    inquirer
                    .prompt([ 
                        {   
                            type: 'list',
                            message: 'pick employee manager',
                            name: "manager",
                            choices: [...newArr]
                        }
                    ])
                    .then(user => {
                        let manId = resultArr.find(e => e.Manager == user.manager)
                        connection.query('INSERT INTO employee SET ?',
                            {
                            first_name: userFirst.firstName,
                            last_name: userLast.lastName,
                            roles_id: jobRole[0][1],
                            manager_id: manId.id
                            }, (err) => {
                                if (err) throw err
                                console.log("employee created")
                                startInit()
                        })
                    })
                })
            } else {
                connection.query('INSERT INTO employee SET ?',
                    {
                    first_name: userFirst.firstName,
                    last_name: userLast.lastName,
                    roles_id: jobRole[0][1],
                    manager_id: null
                    }, (err) => {
                        if (err) throw err
                        console.log("employee created")
                        startInit()
                })        
            }
        })
        })
        })
        })
}


module.exports = addOpt