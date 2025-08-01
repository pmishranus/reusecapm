const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Salaries } = this.entities;

    // Get the employee service using CAPM's service reuse mechanism
    let employeeService;
    try {
        // Connect to the EmployeeService using service discovery
        employeeService = await cds.connect.to('EmployeeService');
        console.log('Successfully connected to EmployeeService');
    } catch (error) {
        console.error('Failed to connect to EmployeeService:', error.message);
        console.log('Make sure the employee application is deployed and accessible');
    }

    this.on('getEmployeeInfo', async (req) => {
        const { employeeNumber } = req.data;

        try {
            if (!employeeService) {
                throw new Error('Employee service is not available. Please ensure the employee application is deployed and accessible.');
            }

            // Call the employee service to get employee information
            const employeeResult = await employeeService.getEmployeeByNumber(employeeNumber);

            if (!employeeResult) {
                throw new Error(`Employee with number ${employeeNumber} not found`);
            }

            // Get salary information for the employee
            const salaryResult = await SELECT.from(Salaries)
                .where({ employeeID: employeeResult.ID, isActive: 'Y' })
                .limit(1);

            const salary = salaryResult[0] || {
                baseSalary: 0,
                bonus: 0,
                allowances: 0
            };

            // Return combined employee and salary information
            return {
                employeeID: employeeResult.employeeNumber,
                firstName: employeeResult.firstName,
                lastName: employeeResult.lastName,
                email: employeeResult.email,
                baseSalary: salary.baseSalary,
                bonus: salary.bonus,
                allowances: salary.allowances
            };
        } catch (error) {
            console.error('Error in getEmployeeInfo:', error);
            req.error(500, `Error retrieving employee info: ${error.message}`);
        }
    });

    this.on('getAllEmployeesWithSalary', async (req) => {
        try {
            if (!employeeService) {
                throw new Error('Employee service is not available. Please ensure the employee application is deployed and accessible.');
            }

            // Get all active employees from employee service
            const employees = await employeeService.getActiveEmployees();

            const result = [];

            for (const employee of employees) {
                // Get salary information for each employee
                const salaryResult = await SELECT.from(Salaries)
                    .where({ employeeID: employee.ID, isActive: 'Y' })
                    .limit(1);

                const salary = salaryResult[0] || {
                    baseSalary: 0,
                    bonus: 0,
                    allowances: 0
                };

                result.push({
                    employeeID: employee.employeeNumber,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    baseSalary: salary.baseSalary,
                    bonus: salary.bonus,
                    allowances: salary.allowances
                });
            }

            return result;
        } catch (error) {
            console.error('Error in getAllEmployeesWithSalary:', error);
            req.error(500, `Error retrieving employees with salary: ${error.message}`);
        }
    });

    // Add a simple action to create salary records
    this.on('createSalary', async (req) => {
        const { employeeID, baseSalary, bonus, allowances, effectiveDate, endDate } = req.data;

        try {
            const salaryData = {
                ID: cds.utils.uuid(),
                employeeID,
                baseSalary,
                bonus,
                allowances,
                effectiveDate,
                endDate,
                isActive: 'Y'
            };

            const result = await INSERT.into(Salaries).entries(salaryData);
            return salaryData;
        } catch (error) {
            console.error('Error in createSalary:', error);
            req.error(500, `Error creating salary record: ${error.message}`);
        }
    });
});
