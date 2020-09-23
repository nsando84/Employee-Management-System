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
                    // addRole();   
                break;
                case 'Delete Department':
                    // addDept();
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
        // console.log(newArr)
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
                                console.log('\x1b[35m Employee has been deleted.')
                                startInit()
                            })
                            }
                    })



            })



})

}



module.exports = delEmp