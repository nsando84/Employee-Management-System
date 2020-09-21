SELECT
	employee.first_name,
    employee.last_name,
    roles.title,
    roles.salary,
    roles.department_id,
    department.dept_name,
    roles.manager_id
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id

