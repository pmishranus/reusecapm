const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function () {
    const { Client, Project, ProjectTeamMember, Contact } = this.entities;

    // Get the employee service from the separate application
    const employeeService = await cds.connect.to('employee-master');

    // Business Action: Create Client with Employee Management
    this.on('createClientWithEmployee', async (req) => {
        const {
            clientNumber,
            name,
            industry,
            size,
            website,
            accountManagerID,
            createEmployeeIfNotExists,
            employeeData
        } = req.data;

        // Validate input
        if (!clientNumber || !name) {
            throw new Error('Client number and name are required');
        }

        // Check if client number already exists
        const existingClient = await SELECT.from(Client).where({ clientNumber });
        if (existingClient.length > 0) {
            throw new Error('Client number already exists');
        }

        let employeeID = accountManagerID;
        let employeeCreated = false;

        // Step 1: Check if employee exists in employee-master
        if (accountManagerID) {
            try {
                const existingEmployee = await employeeService.run(
                    SELECT.from('Employee').where({ ID: accountManagerID })
                );

                if (existingEmployee.length === 0) {
                    if (!createEmployeeIfNotExists) {
                        throw new Error('Employee not found and createEmployeeIfNotExists is false');
                    }

                    // Step 2: Create employee in employee-master if not exists
                    if (!employeeData) {
                        throw new Error('Employee data is required when creating new employee');
                    }

                    console.log('Creating new employee in employee-master service...');

                    // Create employee using employee-master service
                    const hireResult = await employeeService.run(
                        INSERT.into('Employee').entries({
                            ID: uuidv4(),
                            employeeNumber: employeeData.employeeNumber,
                            firstName: employeeData.firstName,
                            lastName: employeeData.lastName,
                            email: employeeData.email,
                            phone: employeeData.phone,
                            hireDate: employeeData.hireDate,
                            salary: employeeData.salary,
                            department_ID: employeeData.departmentID,
                            position_ID: employeeData.positionID,
                            isActive: true
                        })
                    );

                    // Get the created employee ID
                    const createdEmployee = await employeeService.run(
                        SELECT.from('Employee').where({ employeeNumber: employeeData.employeeNumber })
                    );

                    if (createdEmployee.length === 0) {
                        throw new Error('Failed to create employee in employee-master service');
                    }

                    employeeID = createdEmployee[0].ID;
                    employeeCreated = true;

                    console.log(`Employee created successfully with ID: ${employeeID}`);
                } else {
                    console.log(`Using existing employee with ID: ${accountManagerID}`);
                }
            } catch (error) {
                console.error('Error checking/creating employee:', error);
                throw new Error(`Employee management failed: ${error.message}`);
            }
        }

        // Step 3: Create client with the employee (existing or newly created)
        try {
            const clientID = uuidv4();
            const newClient = {
                ID: clientID,
                clientNumber,
                name,
                industry,
                size,
                website,
                accountManager_ID: employeeID,
                isActive: true
            };

            await INSERT.into(Client).entries(newClient);

            console.log(`Client created successfully with ID: ${clientID}`);

            return {
                clientID,
                employeeID,
                message: `Client ${name} created successfully${employeeCreated ? ' with new employee' : ' with existing employee'}`,
                employeeCreated
            };
        } catch (error) {
            console.error('Error creating client:', error);

            // If client creation fails and we created an employee, we should clean up
            if (employeeCreated && employeeID) {
                try {
                    console.log('Cleaning up created employee due to client creation failure...');
                    await employeeService.run(
                        UPDATE('Employee').set({ isActive: false }).where({ ID: employeeID })
                    );
                } catch (cleanupError) {
                    console.error('Error cleaning up employee:', cleanupError);
                }
            }

            throw new Error(`Client creation failed: ${error.message}`);
        }
    });

    // Business Action: Create Client (existing implementation)
    this.on('createClient', async (req) => {
        const { clientNumber, name, industry, size, website, accountManagerID } = req.data;

        // Validate input
        if (!clientNumber || !name || !accountManagerID) {
            throw new Error('Required fields missing');
        }

        // Check if client number already exists
        const existingClient = await SELECT.from(Client).where({ clientNumber });
        if (existingClient.length > 0) {
            throw new Error('Client number already exists');
        }

        // Verify account manager exists
        try {
            const accountManager = await employeeService.run(
                SELECT.from('Employee').where({ ID: accountManagerID })
            );
            if (accountManager.length === 0) {
                throw new Error('Account manager not found');
            }
        } catch (error) {
            throw new Error('Unable to verify account manager: ' + error.message);
        }

        // Create new client
        const clientID = uuidv4();
        const newClient = {
            ID: clientID,
            clientNumber,
            name,
            industry,
            size,
            website,
            accountManager_ID: accountManagerID,
            isActive: true
        };

        await INSERT.into(Client).entries(newClient);

        return {
            clientID,
            message: `Client ${name} created successfully`
        };
    });

    // Business Action: Create Project
    this.on('createProject', async (req) => {
        const { projectNumber, name, description, startDate, endDate, budget, clientID, projectManagerID } = req.data;

        // Validate input
        if (!projectNumber || !name || !clientID || !projectManagerID) {
            throw new Error('Required fields missing');
        }

        // Check if project number already exists
        const existingProject = await SELECT.from(Project).where({ projectNumber });
        if (existingProject.length > 0) {
            throw new Error('Project number already exists');
        }

        // Verify client exists
        const client = await SELECT.from(Client).where({ ID: clientID });
        if (client.length === 0) {
            throw new Error('Client not found');
        }

        // Verify project manager exists in employee service
        try {
            const projectManager = await employeeService.run(
                SELECT.from('Employee').where({ ID: projectManagerID })
            );
            if (projectManager.length === 0) {
                throw new Error('Project manager not found');
            }
        } catch (error) {
            throw new Error('Unable to verify project manager: ' + error.message);
        }

        // Create new project
        const projectID = uuidv4();
        const newProject = {
            ID: projectID,
            projectNumber,
            name,
            description,
            startDate,
            endDate,
            budget,
            client_ID: clientID,
            projectManager_ID: projectManagerID,
            status: 'planning'
        };

        await INSERT.into(Project).entries(newProject);

        return {
            projectID,
            message: `Project ${name} created successfully`
        };
    });

    // Business Action: Assign Team Member
    this.on('assignTeamMember', async (req) => {
        const { projectID, employeeID, role, startDate, allocation } = req.data;

        // Validate input
        if (!projectID || !employeeID || !role || !startDate) {
            throw new Error('Required fields missing');
        }

        // Verify project exists
        const project = await SELECT.from(Project).where({ ID: projectID });
        if (project.length === 0) {
            throw new Error('Project not found');
        }

        // Verify employee exists in employee service
        try {
            const employee = await employeeService.run(
                SELECT.from('Employee').where({ ID: employeeID })
            );
            if (employee.length === 0) {
                throw new Error('Employee not found');
            }
        } catch (error) {
            throw new Error('Unable to verify employee: ' + error.message);
        }

        // Check if employee is already assigned to this project
        const existingAssignment = await SELECT.from(ProjectTeamMember)
            .where({ project_ID: projectID, employee_ID: employeeID, isActive: true });
        if (existingAssignment.length > 0) {
            throw new Error('Employee is already assigned to this project');
        }

        // Create team member assignment
        const teamMemberID = uuidv4();
        const newTeamMember = {
            ID: teamMemberID,
            project_ID: projectID,
            employee_ID: employeeID,
            role,
            startDate,
            allocation: allocation || 1.0,
            isActive: true
        };

        await INSERT.into(ProjectTeamMember).entries(newTeamMember);

        return {
            message: `Employee assigned to project successfully`
        };
    });

    // Business Action: Update Project Status
    this.on('updateProjectStatus', async (req) => {
        const { projectID, status } = req.data;

        const project = await SELECT.from(Project).where({ ID: projectID });
        if (project.length === 0) {
            throw new Error('Project not found');
        }

        // Validate status
        const validStatuses = ['planning', 'active', 'completed', 'onHold', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid project status');
        }

        await UPDATE(Project)
            .set({ status })
            .where({ ID: projectID });

        return {
            message: `Project status updated to ${status}`
        };
    });

    // Function: Get Client Projects
    this.on('getClientProjects', async (req) => {
        const { clientID } = req.data;

        return await SELECT.from(Project)
            .where({ client_ID: clientID })
            .expand('projectManager');
    });

    // Function: Get Project Team
    this.on('getProjectTeam', async (req) => {
        const { projectID } = req.data;

        return await SELECT.from(ProjectTeamMember)
            .where({ project_ID: projectID, isActive: true })
            .expand('employee');
    });

    // Function: Get Available Employees
    this.on('getAvailableEmployees', async (req) => {
        try {
            return await employeeService.run(
                SELECT.from('Employee')
                    .where({ isActive: true })
                    .expand('department', 'position')
            );
        } catch (error) {
            throw new Error('Unable to fetch employees: ' + error.message);
        }
    });

    // Function: Get Client by Number
    this.on('getClientByNumber', async (req) => {
        const { clientNumber } = req.data;

        const client = await SELECT.from(Client)
            .where({ clientNumber })
            .expand('accountManager');

        return client[0] || null;
    });

    // Function: Check Employee Exists
    this.on('checkEmployeeExists', async (req) => {
        const { employeeID } = req.data;

        try {
            const employee = await employeeService.run(
                SELECT.from('Employee').where({ ID: employeeID })
            );
            return employee.length > 0;
        } catch (error) {
            console.error('Error checking employee existence:', error);
            return false;
        }
    });

    // Before CREATE hooks
    this.before('CREATE', 'Clients', async (req) => {
        if (!req.data.ID) {
            req.data.ID = uuidv4();
        }
        req.data.createdAt = new Date();
        req.data.updatedAt = new Date();
    });

    this.before('CREATE', 'Projects', async (req) => {
        if (!req.data.ID) {
            req.data.ID = uuidv4();
        }
        req.data.createdAt = new Date();
        req.data.updatedAt = new Date();
    });

    this.before('CREATE', 'ProjectTeamMembers', async (req) => {
        if (!req.data.ID) {
            req.data.ID = uuidv4();
        }
        req.data.createdAt = new Date();
        req.data.updatedAt = new Date();
    });

    // Before UPDATE hooks
    this.before('UPDATE', 'Clients', async (req) => {
        req.data.updatedAt = new Date();
    });

    this.before('UPDATE', 'Projects', async (req) => {
        req.data.updatedAt = new Date();
    });

    this.before('UPDATE', 'ProjectTeamMembers', async (req) => {
        req.data.updatedAt = new Date();
    });
}); 