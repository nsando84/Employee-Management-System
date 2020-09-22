SELECT roles.title, roles.reports_to, department.dept_name As Dept
FROM roles INNER JOIN department on roles.department_id = department.id
WHERE roles.manager_id <> " " AND department.id = 1
