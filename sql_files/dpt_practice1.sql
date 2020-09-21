SELECT
	role.title,
    role.salary,
    department.dept_name
FROM role
INNER JOIN department
on role.department_id = department.id
