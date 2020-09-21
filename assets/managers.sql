SELECT
	employee.first_name,
    employee.last_name,
	m.title AS Manager
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id
INNER JOIN roles m 
on roles.reports_to = m.manager_id