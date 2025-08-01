using com.consumer.master as consumer from '../db/schema';

@path: 'consumer'
service ConsumerService {
    entity Salaries as projection on consumer.Salary;

    // Function to get employee info with salary details
    function getEmployeeInfo(employeeNumber : String(10)) returns {
        employeeID : String(10);
        firstName : String(50);
        lastName : String(50);
        email : String(100);
        baseSalary : Decimal(10, 2);
        bonus : Decimal(10, 2);
        allowances : Decimal(10, 2);
    };

    // Function to get all employees with their salary information
    function getAllEmployeesWithSalary()                  returns {
        employeeID : String(10);
        firstName : String(50);
        lastName : String(50);
        email : String(100);
        baseSalary : Decimal(10, 2);
        bonus : Decimal(10, 2);
        allowances : Decimal(10, 2);
    };

    // Action to create salary records
    action   createSalary(employeeID : UUID,
                          baseSalary : Decimal(10, 2),
                          bonus : Decimal(10, 2),
                          allowances : Decimal(10, 2),
                          effectiveDate : Date,
                          endDate : Date)                 returns {
        ID : UUID;
        employeeID : UUID;
        baseSalary : Decimal(10, 2);
        bonus : Decimal(10, 2);
        allowances : Decimal(10, 2);
        effectiveDate : Date;
        endDate : Date;
        isActive : String(10);
    };
}
