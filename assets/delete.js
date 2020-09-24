const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()


delEmp = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: '\x1b[34m Delete Menu',
                name: 'add',
                choices: [
                    new inquirer.Separator(),
                    'Delete Employee',
                    'Delete Role',
                    'Delete Department',
                    new inquirer.Separator(),
                    '\x1b[33m Go back'
                ]
            }
        ])
        .then(user =>{
            switch (user.add) {
                case 'Delete Employee':
                    deleteEmployee();
                break;
                case 'Delete Role':
                    deleteRole();   
                break;
                case 'Delete Department':
                    deleteDept();
                break;
            default:
                startInit();
            }
        })   



}


deleteEmployee = () => {
    const queryUpdateRole = `SELECT CONCAT (employee.first_name, " ", employee.last_name) As Name, employee.id,
    employee.manager_id, department.dept_name, roles.title, roles.salary, roles.manager_id,
	CONCAT (m.first_name, " ", m.last_name) As Manager FROM employee INNER JOIN roles
    on employee.roles_id = roles.id INNER JOIN department on roles.department_id = department.id
    LEFT JOIN employee m on employee.manager_id = m.id`
    connection.query(queryUpdateRole, (err, result) =>{
        if (err) throw err;
        let resultArr = []
        let newArr = []
        result.forEach(e => resultArr.unshift(Object.values(e)))
        resultArr.forEach(e => newArr.push(e[0]+ " - " + "Title: "+e[4]+ " - "+ "Dept: " +e[3]+ " - "+ "Current Manager: "+e[6]))
        newArr.push(new inquirer.Separator())
        newArr.push('\x1b[33m Go back')    
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Pick an employee:',
                    name: 'userPick',
                    pageSize: 12,
                    choices: [...newArr]
                }
            ])
            .then(user =>{
                if (user.userPick == '\x1b[33m Go back') {
                    delEmp()
                } else {
                let findRole = user.userPick.split("-")
                let finalArr = resultArr.filter(e=> e[0].replace(/\s/g, '') == findRole[0].replace(/\s/g, ''))
                inquirer
                    .prompt([
                        {
                            type: 'confirm',
                            message: `Are you sure you want to remove ${finalArr[0][0]}`,
                            name: 'confirmDel'
                        }
                    ])
                    .then(user => {
                        if (!user.confirmDel) {
                            delEmp()     
                        } else if (Number(finalArr[0][2])) {
                            const managerCheck = `SELECT employee.id, employee.first_name, employee.last_name
                            FROM employee WHERE employee.manager_id = ${finalArr[0][1]}`
                            connection.query(managerCheck, (err, result) => {
                                let resultArr2 = []
                                result.forEach(e => resultArr2.unshift(Object.values(e)))
                                for (let i = 0; i < resultArr2.length; i++) {
                                    connection.query(`UPDATE employee SET manager_id = ' ' WHERE employee.id = ${resultArr2[i][0]}`,
                                    (err, result) => {
                                        if (err) throw err;
                                    })
                                }
                                connection.query(`DELETE FROM employee WHERE employee.id = ${finalArr[0][1]}`,
                                 (err, result) => {
                                    if (err) throw err;
                                })
                                console.log("\x1b[35m Employee has been deleted. Manager's employees have been dropped, please reassign.")
                                startInit()
                            })
                        } else {
                            connection.query(`DELETE FROM employee WHERE employee.id = ${finalArr[0][1]}`,
                            (err, result) => {
                                if (err) throw err;
                                console.log(`\x1b[35m ${finalArr[0][0]} has been deleted.`)
                                startInit()
                            })
                            }
                    })
            }})
    })
}


deleteRole = () => {
    const queryCompRole = `SELECT roles.id, roles.title, roles.manager_id, roles.reports_to FROM roles`
    connection.query(queryCompRole, (err, result) => {
    if (err) throw err;
    let resultArr = []
    let newArr = []
    result.forEach(e => resultArr.unshift(Object.values(e)))
    resultArr.sort().forEach(e => newArr.push(e[1]))
    newArr.push(new inquirer.Separator())
    newArr.push('\x1b[33m Go back')    
    inquirer
        .prompt([ 
            {
            type: 'list',
            message: 'Which role would you like to delete?',
            name: 'depRole',
            pageSize: 12,
            choices: [...newArr]
            }
        ])
        .then(user => {
            let roleNum = resultArr.filter(e => e.includes(user.depRole))
            // console.log(roleNum[0])

            const findRole = `SELECT employee.id As empId, roles.id FROM employee INNER JOIN 
            roles on employee.roles_id = roles.id INNER JOIN department on 
            roles.department_id = department.id LEFT JOIN employee m
            on employee.manager_id = m.id WHERE roles.id = ${roleNum[0][0]}`

            connection.query(findRole, (err, result) => {
                // console.log(roleNum[0][2])
                if (result.length > 0) {
                    console.log(`\x1b[31m Unable to delete ${roleNum[0][1]}. Employee(s) need reassignment.`)
                    delEmp()
                } else {

                if (user.depRole == '\x1b[33m Go back') { delEmp() } else {
                    inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                message: `Are you sure you want to remove ${roleNum[0][1]}`,
                                name: 'confirmDel'
                            }
                        ])
                        .then(user => {
                        if (!user.confirmDel) {
                                deleteRole() 
                        } else {
                           console.log(roleNum[0])
                            const managerCheck = `DELETE FROM roles WHERE id = "${roleNum[0][0]}";`
                            connection.query(managerCheck, (err, result) => {
                            if (err) throw err
                            console.log(`\x1b[35m ${roleNum[0][1]} has been deleted.`)
                            delEmp()
                            })
                         }
                        })
                }    
            }
            })
       })
    });   
}

deleteDept = () => {
    const queryDeptRoles = `SELECT dept_name, department.id FROM department`
    connection.query(queryDeptRoles, (err, result) => {
        if (err) throw err;
        let resultArr = []
        result.forEach(e => resultArr.unshift(Object.values(e)))
        let newArr = []
        resultArr.sort().forEach(e => newArr.push(e[0]))
        newArr.push(new inquirer.Separator())
        newArr.push('\x1b[33m Go back')
        console.log(resultArr)
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
        ])
        .then(user => {
            let finalArr = resultArr.filter(e=> e[0] == user.dept)
            console.log(finalArr[0][1])
            const checkTotalEmp = `SELECT roles.id FROM roles WHERE roles.department_id = "${finalArr[0][1]}"`
            console.log(checkTotalEmp)
            connection.query(checkTotalEmp, (err, result) => {
                if (err) throw err;
            if (result.length > 0) {
                console.log(`\x1b[31m Unable to delete ${finalArr[0][0]}. Role(s) need reassignment.`)
                    delEmp()
            } else {
                inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                message: `Are you sure you want to remove ${finalArr[0][0]}`,
                                name: 'confirmDel'
                            }
                        ])
                        .then(user => {
                        if (!user.confirmDel) {
                                deleteRole() 
                        } else {
                            const managerCheck = `DELETE FROM department WHERE id = "${finalArr[0][1]}";`
                            connection.query(managerCheck, (err, result) => {
                            if (err) throw err
                            console.log(`\x1b[35m ${finalArr[0][0]} has been deleted.`)
                            delEmp()
                            })
                         }
                        })
            }
            })
        })
    })
}
module.exports = delEmp