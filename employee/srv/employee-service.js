const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function () {
    const { Employee, Department, Position } = this.entities;

    // Business Action: Hire Employee
    this.on('hireEmployee', async (req) => {
        const { employeeNumber, firstName, lastName, email, phone, hireDate, salary, departmentID, positionID, managerID } = req.data;

        // Validate input
        if (!employeeNumber || !firstName || !lastName || !email) {
            throw new Error('Required fields missing');
        }

        // Check if employee number already exists
        const existingEmployee = await SELECT.from(Employee).where({ employeeNumber });
        if (existingEmployee.length > 0) {
            throw new Error('Employee number already exists');
        }

        // Create new employee
        const employeeID = uuidv4();
        const newEmployee = {
            ID: employeeID,
            employeeNumber,
            firstName,
            lastName,
            email,
            phone,
            hireDate,
            salary,
            department_ID: departmentID,
            position_ID: positionID,
            manager_ID: managerID,
            isActive: true
        };

        await INSERT.into(Employee).entries(newEmployee);

        return {
            employeeID,
            message: `Employee ${firstName} ${lastName} hired successfully`
        };
    });

    // Business Action: Terminate Employee
    this.on('terminateEmployee', async (req) => {
        const { employeeID, terminationDate, reason } = req.data;

        const employee = await SELECT.from(Employee).where({ ID: employeeID });
        if (employee.length === 0) {
            throw new Error('Employee not found');
        }

        await UPDATE(Employee)
            .set({ isActive: false })
            .where({ ID: employeeID });

        return {
            message: `Employee terminated successfully. Reason: ${reason}`
        };
    });

    // Business Action: Transfer Employee
    this.on('transferEmployee', async (req) => {
        const { employeeID, newDepartmentID, newPositionID, effectiveDate } = req.data;

        const employee = await SELECT.from(Employee).where({ ID: employeeID });
        if (employee.length === 0) {
            throw new Error('Employee not found');
        }

        await UPDATE(Employee)
            .set({
                department_ID: newDepartmentID,
                position_ID: newPositionID
            })
            .where({ ID: employeeID });

        return {
            message: `Employee transferred successfully effective ${effectiveDate}`
        };
    });

    // Function: Get Employee by Number
    this.on('getEmployeeByNumber', async (req) => {
        const { employeeNumber } = req.data;

        const employee = await SELECT.from(Employee)
            .where({ employeeNumber })
            .expand('department', 'position', 'manager');

        return employee[0] || null;
    });

    // Function: Get Employees by Department
    this.on('getEmployeesByDepartment', async (req) => {
        const { departmentID } = req.data;

        return await SELECT.from(Employee)
            .where({ department_ID: departmentID, isActive: true })
            .expand('position', 'manager');
    });

    // Function: Get Active Employees
    this.on('getActiveEmployees', async (req) => {
        return await SELECT.from(Employee)
            .where({ isActive: true })
            .expand('department', 'position', 'manager');
    });

    // Before CREATE hook
    this.before('CREATE', 'Employees', async (req) => {
        if (!req.data.ID) {
            req.data.ID = uuidv4();
        }
        req.data.createdAt = new Date();
        req.data.updatedAt = new Date();
    });

    // Before UPDATE hook
    this.before('UPDATE', 'Employees', async (req) => {
        req.data.updatedAt = new Date();
    });
}); 