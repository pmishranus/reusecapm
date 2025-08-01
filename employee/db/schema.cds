namespace com.employee.master;

entity Employee {
    key ID             : UUID;
        employeeNumber : String(10);
        firstName      : String(50);
        lastName       : String(50);
        email          : String(100);
        phone          : String(20);
        hireDate       : Date;
        salary         : Decimal(10, 2);
        isActive       : String(10);
        department     : Association to Department;
        position       : Association to Position;
        manager        : Association to Employee;
        subordinates   : Association to many Employee
                             on subordinates.manager = $self;
        createdAt      : Timestamp  @cds.on.insert: $now;
        updatedAt      : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity Department {
    key ID          : UUID;
        name        : String(100);
        code        : String(10);
        description : String(200);
        manager     : Association to Employee;
        employees   : Association to many Employee
                          on employees.department = $self;
        isActive    : String(10);
        createdAt   : Timestamp  @cds.on.insert: $now;
        updatedAt   : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity Position {
    key ID          : UUID;
        title       : String(100);
        code        : String(10);
        description : String(200);
        level       : Integer;
        isActive    : String(10);
        employees   : Association to many Employee
                          on employees.position = $self;
        createdAt   : Timestamp  @cds.on.insert: $now;
        updatedAt   : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}
