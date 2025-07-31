using com.client.details as client from '../db/schema';

@path: 'dashboard'
service DashboardService @(requires: 'authenticated-user') {

    // Dashboard data aggregation
    action getDashboardData()       returns {
        stats : {
            totalClients : Integer;
            totalProjects : Integer;
            activeProjects : Integer;
            totalEmployees : Integer;
            totalTeamMembers : Integer;
        };
        clients : many client.Client;
        projects : many client.Project;
        timestamp : String;
    };

    // Get projects with team members
    action getProjectsWithTeams()   returns many client.Project;
    // Get clients with account managers
    action getClientsWithManagers() returns many client.Client;
}
