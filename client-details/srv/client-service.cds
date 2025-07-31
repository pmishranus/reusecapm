using com.client.details as client from '../db/schema';

@path: 'client'
service ClientService @(requires: 'authenticated-user') {
    // Client entities
    entity Clients            as projection on client.Client;
    entity Projects           as projection on client.Project;
    entity ProjectTeamMembers as projection on client.ProjectTeamMember;
    entity Contacts           as projection on client.Contact;

    // Business Actions
    action   createClient(clientNumber : String(20),
                          name : String(100),
                          industry : String(50),
                          size : String(20),
                          website : String(200),
                          accountManagerID : UUID);

    action   createClientWithEmployee(clientNumber : String(20),
                                      name : String(100),
                                      industry : String(50),
                                      size : String(20),
                                      website : String(200),
                                      accountManagerID : UUID,
                                      createEmployeeIfNotExists : Boolean,
                                      employeeNumber : String(10),
                                      firstName : String(50),
                                      lastName : String(50),
                                      email : String(100),
                                      phone : String(20),
                                      hireDate : Date,
                                      salary : Decimal(10, 2),
                                      departmentID : UUID,
                                      positionID : UUID);

    action   createProject(projectNumber : String(20),
                           name : String(100),
                           description : String(500),
                           startDate : Date,
                           endDate : Date,
                           budget : Decimal(12, 2),
                           clientID : UUID,
                           projectManagerID : UUID);

    action   assignTeamMember(projectID : UUID,
                              employeeID : UUID,
                              role : String(50),
                              startDate : Date,
                              allocation : Decimal(3, 2));

    action   updateProjectStatus(projectID : UUID,
                                 status : String(20));

    // Functions
    function getClientProjects(clientID : UUID)           returns many Projects;
    function getProjectTeam(projectID : UUID)             returns many ProjectTeamMembers;
    function getAvailableEmployees()                      returns String;
    function getClientByNumber(clientNumber : String(20)) returns Clients;
    function checkEmployeeExists(employeeID : UUID)       returns Boolean;
}
