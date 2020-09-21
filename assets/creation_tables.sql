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
title VARCHAR(30) NOT NULL,
salary decimal NOT NULL,
manager_id TINYINT(1),
PRIMARY KEY(id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
id INT AUTO_INCREMENT,
roles_id INT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (roles_id) REFERENCES roles(id)
);

INSERT INTO department (dept_name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, manager_id, department_id)
VALUES ('Salesperson','80000', '0', '1'),
('Sales Lead', '100000', '1', '1'),
('Software Engineer', '120000', '0', '2'),
('Lead Engineer', '150000', '1', '2'),
('Accountant', '125000', '0', '3'),
('Head Accountant', '150000', '1', '3'),
('Lawyer', '190000', '0', '4'),
('Legal Team Lead', '250000', '1', '4');

INSERT INTO employee (first_name, last_name, roles_id)
VALUES ('Clint', 'Eastwood', '2'), ('Jackie', 'Chan', '1'), ('Kate', 'Upton', '4'),
('Tom', 'Holland', '3'), ('Jason', 'Derulo', '5'), ('Scott', 'Stapp', '8'),
('Chanel', 'Iman', '7'), ('Rob', 'Dyrdek', '6'), ('Daniel', 'Wu', '3')








