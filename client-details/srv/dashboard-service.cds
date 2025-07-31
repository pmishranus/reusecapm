using com.client.details as client from '../db/schema';

@path: 'dashboard'
service DashboardService @(requires: 'authenticated-user') {

    // Dashboard data aggregation
    action getDashboardData();
    // Get projects with team members
    action getProjectsWithTeams();
    // Get clients with account managers
    action getClientsWithManagers();
    // Get available employees
    action getAvailableEmployees();
}
