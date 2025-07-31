namespace com.client.details;

// Employee associations will be handled via service consumption

entity Client {
    key ID             : UUID;
        clientNumber   : String(20);
        name           : String(100);
        industry       : String(50);
        size           : String(20);
        website        : String(200);
        isActive       : Boolean default true;
        accountManagerID : UUID; // Will be linked to employee via service
        projects       : Association to many Project
                             on projects.client = $self;
        contacts       : Association to many Contact
                             on contacts.client = $self;
        createdAt      : Timestamp  @cds.on.insert: $now;
        updatedAt      : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity Project {
    key ID             : UUID;
        projectNumber  : String(20);
        name           : String(100);
        description    : String(500);
        startDate      : Date;
        endDate        : Date;
        status         : String(20) enum {
            planning;
            active;
            completed;
            onHold;
            cancelled;
        };
        budget         : Decimal(12, 2);
        client         : Association to Client;
        projectManagerID : UUID; // Will be linked to employee via service
        teamMembers    : Association to many ProjectTeamMember
                             on teamMembers.project = $self;
        createdAt      : Timestamp  @cds.on.insert: $now;
        updatedAt      : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity ProjectTeamMember {
    key ID         : UUID;
        project    : Association to Project;
        employeeID : UUID; // Will be linked to employee via service
        role       : String(50);
        startDate  : Date;
        endDate    : Date;
        allocation : Decimal(3, 2); // Percentage allocation (0.0 to 1.0)
        isActive   : Boolean default true;
        createdAt  : Timestamp  @cds.on.insert: $now;
        updatedAt  : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity Contact {
    key ID        : UUID;
        firstName : String(50);
        lastName  : String(50);
        email     : String(100);
        phone     : String(20);
        position  : String(100);
        isPrimary : Boolean default false;
        client    : Association to Client;
        createdAt : Timestamp  @cds.on.insert: $now;
        updatedAt : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}
