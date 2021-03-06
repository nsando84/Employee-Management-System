const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()
const validateIt = require('./assets/validate')

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
                name: 'firstName',
                validate: validateIt.validateText
            }
        ])
        .then(userFirst => {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: `Enter last name:`,
                            name: 'lastName',
                            validate: validateIt.validateText
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
                if (job.role == '\x1b[33m Go back') { addOpt()
                } else if (jobRole[0][2] == ' ') {
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
                    newArr.push('\x1b[33m Go back')
                    inquirer
                    .prompt([ 
                        {   
                            type: 'list',
                            message: 'Pick employee manager',
                            name: "manager",
                            choices: [...newArr]
                        }
                    ])
                    .then(user => {
                        if (user.manager == '\x1b[33m Go back' && newArr.length == 1) { 
                            console.log('\x1b[31m Employee needs manager. Please assign a manager.')
                            addOpt()
                        } else if (user.manager == '\x1b[33m Go back'){
                            addOpt() 
                        } else {
                        let manId = resultArr.find(e => e.Manager == user.manager)
                        connection.query('INSERT INTO employee SET ?',
                            {
                            first_name: userFirst.firstName,
                            last_name: userLast.lastName,
                            roles_id: jobRole[0][1],
                            manager_id: manId.id
                            }, (err) => {
                                if (err) throw err
                                console.log("\x1b[35m Employee created")
                                startInit()
                        })
                    }
                    })
                
                })
            } else {
                connection.query('INSERT INTO employee SET ?',
                    {
                    first_name: userFirst.firstName,
                    last_name: userLast.lastName,
                    roles_id: jobRole[0][1],
                    manager_id: " "
                    }, (err) => {
                        if (err) throw err
                        console.log("\x1b[35m Employee created")
                        startInit()
                })        
            }
        })
        })
        })
        })
}


addRole = () => {
    const queryCompRole = `SELECT department.dept_name, department.id As Dept FROM department`
    connection.query(queryCompRole, (err, result) => {
    if (err) throw err;
    let resultArr = []
    let newArr = []
    result.forEach(e => resultArr.unshift(Object.values(e)))
    resultArr.sort().forEach(e => newArr.push(e[0]))
    newArr.push(new inquirer.Separator())
    newArr.push('\x1b[33m Go back')    
    inquirer
        .prompt([ 
            {
            type: 'list',
            message: 'What department will role belong too?',
            name: 'depRole',
            pageSize: 12,
            choices: [...newArr]
            }
        ])
        .then(user => {
            if (user.depRole == '\x1b[33m Go back') { addOpt() } else {
            let roleNum = resultArr.filter(e => e.includes(user.depRole))
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Name of the position:',
                        name: 'posName',
                        validate: validateIt.validateText
                    }
                ])
                .then(userPos =>{
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                message: 'Salary of new position:',
                                name: 'posSal',
                                validate: validateIt.validateNum
                            }
                        ])
                        .then(userSal => {
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        message: 'New role a leadership position?',
                                        name: 'posLed',
                                        choices: [
                                            'Yes',
                                            'No'
                                        ]
                                    }
                                ])
                                .then(userLed => {
                                    if (userLed.posLed == 'Yes') {
                                    const queryCompRole = `SELECT roles.manager_id
                                    FROM roles INNER JOIN department on roles.department_id = department.id`
                                    connection.query(queryCompRole, (err, result) => {
                                    if (err) throw err;
                                    let resultArr = []
                                    let newArr = []
                                    result.forEach(e => resultArr.unshift(Object.values(e)))
                                    resultArr.sort().forEach(e => newArr.push(e[0]))    
                                        inquirer
                                            .prompt([
                                                {
                                                    type: 'input',
                                                    message: 'Please enter in a management ID number',
                                                    validate: validateIt.validateNum3,
                                                    name: 'userNum'
                                                }
                                            ])
                                            .then(userNum => {
                                                if (newArr.some(e => parseFloat(e) == userNum.userNum)) {
                                                    console.log('\x1b[31m Manager number already exists. Please start over.')
                                                    addRole()
                                                } else {
                                                    connection.query('INSERT INTO roles SET ?',
                                                        {
                                                        title: userPos.posName,
                                                        salary: userSal.posSal,
                                                        manager_id: userNum.userNum,
                                                        department_id: roleNum[0][1],
                                                        reports_to: null
                                                        }, (err) => {
                                                            if (err) throw err
                                                            console.log("\x1b[35m Role created")
                                                            startInit()
                                                    })  
                                                }
                                                
                                                
                                            })
                                })
                            } else {
                                const queryLeader = `SELECT roles.title, roles.manager_id, department.dept_name As Dept
                                FROM roles INNER JOIN department on roles.department_id = department.id
                                WHERE roles.manager_id <> " " AND department.id = "${roleNum[0][1]}"`
                                connection.query(queryLeader, (err, result) => {
                                if (err) throw err;
                                    let resultArr = []
                                    let newArr = []
                                    result.forEach(e => resultArr.unshift(Object.values(e)))
                                    resultArr.sort().forEach(e => newArr.push(e[0]))
                                    newArr.push('\x1b[33m Go back')
                                    inquirer
                                        .prompt([
                                            {   
                                                type: 'list',
                                                message: 'What position manages new role?',
                                                name: 'userSupp',
                                                choices: [...newArr]
                                            }
                                        ])
                                        .then(userSupp => {
                                            if (userSupp.userSupp == '\x1b[33m Go back' && newArr.length == 1) { 
                                                console.log('\x1b[31m Role needs managerment. Please assign a managerment role.')
                                                addOpt()
                                            } else if (userSupp.userSupp == '\x1b[33m Go back'){
                                                addOpt() 
                                            } else {
                                            let superNum = []
                                            resultArr.forEach(e => e[0] == userSupp.userSupp ? superNum.push(e[1]) : " ")
                                            connection.query('INSERT INTO roles SET ?',
                                                {
                                                    title: userPos.posName,
                                                    salary: userSal.posSal,
                                                    manager_id: " ",
                                                    department_id: roleNum[0][1],
                                                    reports_to: superNum[0]
                                                    }, (err) => {
                                                        if (err) throw err
                                                        console.log("\x1b[35m Role created")
                                                        startInit()
                                                    }) 
                                            } 
                                        })
                                })
                            }
                        })
                })
                })
        }})
    })    
}; 


addDept = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Name of the new department:',
                name: 'newDept',
                validate: validateIt.validateText
            }
        ])
        .then(newDept => {
            const queryCompRole = `SELECT department.dept_name As Dept FROM department`
            connection.query(queryCompRole, (err, result) => {
            if (err) throw err;
            let resultArr = []
            let newArr = []
            result.forEach(e => resultArr.unshift(Object.values(e)))
            resultArr.sort().forEach(e => newArr.push(e[0]))
            if (newDept.newDept.length < 3 || newArr.some(e => e.toUpperCase() == newDept.newDept.toUpperCase())) {
                console.log("dept name not long enough or already exists. Please start over.")
                addRole()
            } else {
                connection.query('INSERT INTO department SET ?',
                {
                    dept_name: newDept.newDept
                }, (err) => {
                if (err) throw err
                console.log("\x1b[35m Department created")
                startInit()
            })  
            }
        })
        })
};


module.exports = addOpt