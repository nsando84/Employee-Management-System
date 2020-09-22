SELECT
	employee.id,
	CONCAT (employee.first_name, " ", employee.last_name) As Manager
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id
LEFT JOIN employee m
on employee.manager_id = m.id
WHERE
employee.manager_id = " " AND department.dept_name = "Sales"
	