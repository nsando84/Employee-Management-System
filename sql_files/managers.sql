SELECT
	employee.first_name,
    employee.last_name,
   --  roles.title,
   --  roles.salary,
   --  department.dept_name,
   m.title AS Manager
FROM employee
INNER JOIN roles
on employee.roles_id = roles.id
INNER JOIN department
on roles.department_id = department.id
JOIN roles m 
on roles.reports_to = m.manager_id

-- WHERE department.dept_name = "Sales"
WHERE department.dept_name = "Engineering"
-- WHERE department.dept_name = "Finance"
-- WHERE department.dept_name = "Legal"