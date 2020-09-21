SELECT
	employee.first_name,
    employee.last_name,
    roles.title,
    roles.salary,
    department.dept_name,
	m.title AS Manager
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id
LEFT JOIN roles m 
on roles.reports_to = m.manager_id

	
