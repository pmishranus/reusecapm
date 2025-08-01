namespace com.consumer.master;

entity Salary {
    key ID            : UUID;
        employeeID    : UUID;
        baseSalary    : Decimal(10, 2);
        bonus         : Decimal(10, 2);
        allowances    : Decimal(10, 2);
        effectiveDate : Date;
        endDate       : Date;
        isActive      : String(10);
        createdAt     : Timestamp  @cds.on.insert: $now;
        updatedAt     : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}
