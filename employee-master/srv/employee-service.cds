using com.employee.master as employee from '../db/schema';

@path: 'employee'
service EmployeeService @(requires: 'authenticated-user') {
    entity Employees   as projection on employee.Employee;
    entity Departments as projection on employee.Department;
    entity Positions   as projection on employee.Position;

    action   hireEmployee(employeeNumber : String(10),
                          firstName : String(50),
                          lastName : String(50),
                          email : String(100),
                          phone : String(20),
                          hireDate : Date,
                          salary : Decimal(10, 2),
                          departmentID : UUID,
                          positionID : UUID,
                          managerID : UUID);

    action   terminateEmployee(employeeID : UUID,
                               terminationDate : Date,
                               reason : String(200));

    action   transferEmployee(employeeID : UUID,
                              newDepartmentID : UUID,
                              newPositionID : UUID,
                              effectiveDate : Date);

    function getEmployeeByNumber(employeeNumber : String(10)) returns Employees;
    function getEmployeesByDepartment(departmentID : UUID)    returns many Employees;
    function getActiveEmployees()                             returns many Employees;
}
