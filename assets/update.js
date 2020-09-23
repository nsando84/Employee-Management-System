const inquirer = require('inquirer')
const myConn = require('../connect')
const connection = myConn.myConn()


upEmp = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to update?',
                name: 'empUp',
                choices: [
                    new inquirer.Separator(),
                    'Update employee manager',
                    'Update employee role',
                    new inquirer.Separator(),
                    '\x1b[33m Go back'
                ]
            }
        ])
        .then(user => {
            switch (user.empUp) {
                case 'Update employee manager':
                    upDateEmp();
                    break;
                case 'Update employee role':
                    upDateEmpRole();
                    break;
                default:
                    startInit()
            }
        })
}       


upDateEmp = () => {
    const queryUpdateEmployee = `SELECT employee.id, CONCAT (employee.first_name, " ", employee.last_name) As Name,
    roles.title, employee.manager_id, CONCAT (m.first_name," ", m.last_name) As Manager, department.dept_name, roles.manager_id As Man
    FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department
    on roles.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id`
    connection.query(queryUpdateEmployee, (err, result) => {
        if (err) throw err;
        let resultArr = []
        result.forEach(e => resultArr.unshift(Object.values(e)))
        let newArr = []
        resultArr.sort().forEach(e => newArr.push(e[1]+ " - " + "Title: "+e[2]+ " - "+" Current Manager: "+e[4])) 
        newArr.push(new inquirer.Separator())
        newArr.push('\x1b[33m Go back')
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Pick employee to update',
                    pageSize: 12,
                    name: 'empName',
                    choices: [...newArr]
                }
            ])
            .then(user => {
                if (user.empName == '\x1b[33m Go back') { upEmp() } else {
                let findDept = user.empName.split("-")
                let finalArr = resultArr.filter(e=> e[1].replace(/\s/g, '') == findDept[0].replace(/\s/g, ''))
                const queryUpdateEmployeeMan = `SELECT employee.id, CONCAT (employee.first_name, " ", employee.last_name) As Manager, roles.manager_id
                FROM employee INNER JOIN roles on employee.roles_id = roles.id INNER JOIN department on roles.department_id = department.id
                LEFT JOIN employee m on employee.manager_id = m.id WHERE roles.manager_id <> " " AND department.dept_name = "${finalArr[0][5]}"`
                connection.query(queryUpdateEmployeeMan, (err, result) => {
                    if (err) throw err;
                    let resultArr = []
                    let newArr = []
                    result.forEach(e => resultArr.unshift(Object.values(e)))
                    resultArr.forEach(e => newArr.push(e[1]))
                    newArr.push(new inquirer.Separator())
                    newArr.push('\x1b[33m Go back')
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: `Pick manager from ${finalArr[0][5]}`,
                                name: 'managerPick',
                                choices: [...newArr]
                            }
                         ])
                         .then(user => {
                            if (user.managerPick == '\x1b[33m Go back') { upDateEmp() 
                            } else if (finalArr[0][4] == user.managerPick || finalArr[0][1] == user.managerPick || 
                                    finalArr[0][6] == resultArr[0][2]) {
                                console.log("\x1b[31m Manager changed not within guidelines. Please start over.")
                                upEmp() 
                            } else {
                                let finalMan = resultArr.filter(e=> e[1].replace(/\s/g, '') == user.managerPick.replace(/\s/g, ''))
                                const updateMan = `UPDATE employee SET manager_id = ${finalMan[0][0]} WHERE id = ${finalArr[0][0]}`
                                connection.query(updateMan, (err, result) => {
                                    if (err) throw err
                                    console.log('\x1b[35m Updated manager')
                                    startInit()
                                })
                               
                            }
                             
                         })
                })

            }})
    })
}

upDateEmpRole = () => {
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
        // console.log(newArr)

        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Pick an employee:',
                    name: 'userPick',
                    choices: [...newArr]
                }
            ])
            .then(user => {
                let findRole = user.userPick.split("-")
                let finalArr = resultArr.filter(e=> e[0].replace(/\s/g, '') == findRole[0].replace(/\s/g, ''))
                // console.log(finalArr)

                const queryEmpRoles = `SELECT roles.id, roles.title FROM roles`
                connection.query(queryEmpRoles, (err, result) => {
                    let resultArr = []
                    let newArr = []
                    result.forEach(e => resultArr.unshift(Object.values(e)))
                    resultArr.forEach(e => newArr.push(e[1]))
                    // console.log(newArr)
                    inquirer
                    .prompt([
                        {
                            type: 'list',
                            message: `Pick a new role for ${finalArr[0][0]}`,
                            name: 'userPickRole',
                            choices: [...newArr]
                        }
                    ])
                    .then(user => {
                        if (user.userPickRole.replace(/\s/g, '') == finalArr[0][4].replace(/\s/g, '')) {
                            console.log(`\x1b[31m Employee is already a ${finalArr[0][4]}`)
                            upEmp() 
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
                                let newArr = resultArr.filter(e => e[1] == user.userPickRole)
                                connection.query(`UPDATE employee SET roles_id = '${newArr[0][0]}' WHERE employee.id = ${finalArr[0][1]}`,
                                 (err, result) => {
                                    if (err) throw err;
                                })
                                console.log("\x1b[35m Changed role of employee. Manager's employees have been dropped, please reassign.")
                                upEmp()
                            })
                        } else {
                            let newArr = resultArr.filter(e => e[1] == user.userPickRole)   
                            connection.query(`UPDATE employee SET roles_id = '${newArr[0][0]}' WHERE employee.id = ${finalArr[0][1]}`,
                            (err, result) => {
                                if (err) throw err;
                                console.log('\x1b[35m Changed role of employee')
                                upEmp()
                            })
                            }
                    })
                })
            })

  })






}

module.exports = upEmp