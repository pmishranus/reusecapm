const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    // Get the employee service from the separate application
    const employeeService = await cds.connect.to('employee-master');

    // Dashboard data aggregation
    this.on('getDashboardData', async (req) => {
        try {
            // Fetch data from both services in parallel
            const [clients, projects, employees] = await Promise.all([
                SELECT.from('Clients').expand('accountManager'),
                SELECT.from('Projects').expand('projectManager', 'teamMembers/employee'),
                employeeService.run(SELECT.from('Employee').expand('department', 'position'))
            ]);

            // Calculate statistics
            const stats = {
                totalClients: clients.length,
                totalProjects: projects.length,
                activeProjects: projects.filter(p => p.status === 'active').length,
                totalEmployees: employees.length,
                totalTeamMembers: projects.reduce((total, p) => total + (p.teamMembers?.length || 0), 0)
            };

            return {
                stats,
                clients,
                projects,
                employees,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to fetch dashboard data: ' + error.message);
        }
    });

    // Get projects with team members
    this.on('getProjectsWithTeams', async (req) => {
        try {
            return await SELECT.from('Projects')
                .expand('projectManager', 'teamMembers/employee');
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw new Error('Failed to fetch projects: ' + error.message);
        }
    });

    // Get clients with account managers
    this.on('getClientsWithManagers', async (req) => {
        try {
            return await SELECT.from('Clients')
                .expand('accountManager');
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw new Error('Failed to fetch clients: ' + error.message);
        }
    });

    // Get available employees from employee master
    this.on('getAvailableEmployees', async (req) => {
        try {
            return await employeeService.run(
                SELECT.from('Employee')
                    .where({ isActive: true })
                    .expand('department', 'position')
            );
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw new Error('Failed to fetch employees: ' + error.message);
        }
    });
}); 