DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
id INT AUTO_INCREMENT,
dept_name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE roles(
id INT AUTO_INCREMENT,
department_id INT,
Title VARCHAR(30) NOT NULL,
Salary decimal NOT NULL,
manager_id int,
reports_to int,
PRIMARY KEY(id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
id INT AUTO_INCREMENT,
roles_id INT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
manager_id VARCHAR(30),
PRIMARY KEY(id),
FOREIGN KEY (roles_id) REFERENCES roles(id)
);

INSERT INTO department (dept_name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO roles (title, salary, manager_id, department_id, reports_to)
VALUES ('Salesperson','80000', null, '1','333'),
('Sales Lead', '100000', '333', '1', null),
('Software Engineer', '120000', null, '2','444'),
('Lead Engineer', '150000', '444', '2', null),
('Accountant', '125000', null, '3','555'),
('Head Accountant', '150000', '555','3',null),
('Lawyer', '190000', null, '4', '777'),
('Legal Team Lead', '250000', '777','4',null);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ('Clint', 'Eastwood', '2', " "), ('Jackie', 'Chan', '1', "1"), ('Kate', 'Upton', '4', " "),
('Tom', 'Holland', '3', "3"), ('Jason', 'Derulo', '5', "8"), ('Scott', 'Stapp', '8', " "),
('Chanel', 'Iman', '7', "6"), ('Rob', 'Dyrdek', '6', " "), ('Daniel', 'Wu', '3', "3")








