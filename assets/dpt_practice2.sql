SELECT
	employee.first_name,
    employee.last_name,
    roles.title,
    roles.salary,
    roles.manager_id,
    department.dept_name
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id



