SELECT
	employee.first_name,
    employee.last_name,
    employee.id,
    employee.manager_id,
    department.dept_name,
    roles.title,
    roles.salary,
	CONCAT (m.first_name, " ", m.last_name) As Manager
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id
LEFT JOIN employee m
on employee.manager_id = m.id




