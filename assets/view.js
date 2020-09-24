const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()
var clog = require('c-log')

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
                    allEmployee();   
                    break;
                case 'Managers':
                    allManager();    
                    break;
                case 'Non-Managers':
                    allNonManager();    
                    break;  
                case 'Employees By Roles':
                    employeesByRoles();
                break;      
                case 'Employees By Departments':
                    employeesByDept();
                break;     
                case 'Company Roles':
                    companyRoles();
                break;
                case 'Company Departments':
                    companyDept();
                break;
            default:
                startInit()
            }
       })
}

allEmployee = () => {
        const queryAll = `SELECT employee.first_name As First, employee.last_name As Last,
        roles.title As Title, roles.salary As Salary ,department.dept_name As Dept,
        CONCAT (m.first_name, " ", m.last_name) As Manager
        FROM employee LEFT JOIN roles on employee.roles_id = roles.id LEFT JOIN department
        on roles.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id` 
    connection.query(queryAll, (err, result) => {
    if (err) throw err;
    clog.table(result)
    inquirer 
    .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
    .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
    })
}

allManager = () => {
        const queryMan = `SELECT employee.first_name As First, employee.last_name As Last,
        roles.title As Title, roles.salary As Salary ,department.dept_name As Dept,
        CONCAT (m.first_name, " ", m.last_name) As Manager
        FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department
        on roles.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id
        WHERE roles.manager_id <> " "`
    connection.query(queryMan, (err, result) => {
    if (err) throw err;
    clog.table(result)
    inquirer 
        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
    })
}

allNonManager = () => {
        const queryNonMan = `SELECT employee.first_name As First, employee.last_name As Last,
        roles.title As Title, roles.salary As Salary ,department.dept_name As Dept,
        CONCAT (m.first_name, " ", m.last_name) As Manager
        FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department
        on roles.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id
        WHERE roles.manager_id = " "`
    connection.query(queryNonMan, (err, result) => {
    if (err) throw err;
    clog.table(result)
    inquirer 
        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
    })
}

employeesByRoles = () => {
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
                choices: 
                    [...newArr]
            }
        ]).then(user => {
            const queryEmpRole = `SELECT employee.first_name As First, employee.last_name As Last,
            roles.title As Title, roles.salary As Salary ,department.dept_name As Dept,
            CONCAT (m.first_name, " ", m.last_name) As Manager
            FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department
            on roles.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id
            WHERE roles.title = "${user.role}"`
        connection.query(queryEmpRole, (err, result) => {
        if (err) throw err;
        clog.table(result)
        inquirer 
            .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
            .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
        })
        })
    })
}

employeesByDept = () => {
    const queryDeptRoles = `SELECT dept_name FROM department`
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
                message: '\x1b[34m View employees by role',
                name: 'dept',
                pageSize: 12,
                choices: 
                    [...newArr]
            }
        ]).then(user => {
            const queryEmpRole = `SELECT employee.first_name As First, employee.last_name As Last,
            roles.title As Title, roles.salary As Salary ,department.dept_name As Dept,
            CONCAT (m.first_name, " ", m.last_name) As Manager
            FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department
            on roles.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id
            WHERE department.dept_name = "${user.dept}"`
        connection.query(queryEmpRole, (err, result) => {
        if (err) throw err;
        clog.table(result)
        inquirer 
            .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
            .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
        })
        })
    })
}

companyRoles = () => {
        const queryCompRole = `SELECT roles.title As Title, department.dept_name As Dept
        FROM roles INNER JOIN department on roles.department_id = department.id`
    connection.query(queryCompRole, (err, result) => {
    if (err) throw err;
    clog.table(result)
    inquirer 
        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
    })
}

companyDept = () => {
        const queryCompRole = `SELECT department.dept_name As Dept FROM department`
    connection.query(queryCompRole, (err, result) => {
    if (err) throw err;
    clog.table(result)
    inquirer 
        .prompt([{type: 'list', message: '\x1b[34m Complete', choices: ['\x1b[33m Go back'], name: 'back'}])
        .then(user => user.back == '\x1b[33m Go back' ? eView() : "")
})
}

module.exports = eView


