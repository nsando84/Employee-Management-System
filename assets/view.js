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
                pageSize: 12,
                choices: [
                    new inquirer.Separator(),
                    'All Employees',
                    'Managers',
                    'Non-Managers',
                    'Employees By Roles',
                    'Employees By Departments',
                    'Company Roles',
                    'Company Departments',
                    new inquirer.Separator(),
                    '\x1b[33m Go back'
                ]
            }
        ])
        .then(user => {
            switch (user.view) {
                case 'All Employees':
                        const queryAll = `SELECT employee.first_name As First, employee.last_name As Last, 
                        department.dept_name As Dept, roles.title, roles.salary, manager_name As Manager
                        FROM employee
                        INNER JOIN roles
                        on employee.roles_id = roles.id
                        INNER JOIN department
                        on roles.department_id = department.id`   
                    connection.query(queryAll, (err, result) => {
                    if (err) throw err;
                    console.table(result)
                    inquirer 
                        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
                        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
                    })
                    break;
                case 'Managers':
                        const queryMan = `SELECT employee.first_name As First, employee.last_name As Last,
                        department.dept_name As Dept, roles.title, roles.salary
                        FROM employee
                        INNER JOIN roles
                        on employee.roles_id = roles.id
                        INNER JOIN department
                        on roles.department_id = department.id
                        WHERE manager_name = " "`
                    connection.query(queryMan, (err, result) => {
                    if (err) throw err;
                    console.table(result)
                    inquirer 
                        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
                        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
                    })
                    break;
                case 'Non-Managers':
                        const queryNonMan = `SELECT employee.first_name As First, employee.last_name As Last,
                        department.dept_name As Dept, roles.title, roles.salary, manager_name
                        FROM employee
                        INNER JOIN roles
                        on employee.roles_id = roles.id
                        INNER JOIN department
                        on roles.department_id = department.id
                        JOIN roles m 
                        on roles.reports_to = m.manager_id`
                    connection.query(queryNonMan, (err, result) => {
                    if (err) throw err;
                    console.table(result)
                    inquirer 
                        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
                        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
                    })
                    break;  
                case 'Employees By Roles':
                        EmployeesByRoles()
                break;      
                case 'Employees By Departments':
                        EmployeesByDept()
                break;     



            }




        })
}


EmployeesByRoles = () => {
    const queryEmpRoles = `SELECT roles.title FROM roles`
    connection.query(queryEmpRoles, (err, result) => {
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
        ]).then(user => {
            console.log(user.role)
            const queryEmpRole = `SELECT employee.first_name As First, employee.last_name As Last, 
            department.dept_name As Dept, roles.title, roles.salary, manager_name As Manager
            FROM employee
            INNER JOIN roles
            on employee.roles_id = roles.id
            INNER JOIN department
            on roles.department_id = department.id
            WHERE roles.title = "${user.role}"`
        connection.query(queryEmpRole, (err, result) => {
        if (err) throw err;
        console.table(result)
        inquirer 
            .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
            .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
        })
        })
    })
}

EmployeesByDept = () => {
    const queryDeptRoles = `SELECT dept_name FROM department`
    connection.query(queryDeptRoles, (err, result) => {
        if (err) throw error;
        let resultArr = []
        result.forEach(e => resultArr.unshift(Object.values(e)))
        let newArr = []
        resultArr.sort().forEach(e => newArr.push(e[0]))
        newArr.push(new inquirer.Separator())
        newArr.push('\x1b[33m Go back')
        console.log(newArr)
    inquirer  
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m View employees by role',
                name: 'dept',
                pageSize: 12,
                choices: 
                    [...newArr]
            }
        ]).then(user => {
            const queryEmpRole = `SELECT employee.first_name As First, employee.last_name As Last, 
            department.dept_name As Dept, roles.title, roles.salary, manager_name As Manager
            FROM employee
            INNER JOIN roles
            on employee.roles_id = roles.id
            INNER JOIN department
            on roles.department_id = department.id
            WHERE department.dept_name = "${user.dept}"`
        connection.query(queryEmpRole, (err, result) => {
        if (err) throw err;
        console.table(result)
        inquirer 
            .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
            .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
        })
        })
    })
}

  

module.exports = eView


