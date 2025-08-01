# Consumer Application

This is a SAP CAPM consumer application that demonstrates service reuse by consuming the Employee Service from the employee application.

## Features

- **Salary Management**: Manages salary information for employees
- **Service Reuse**: Consumes the Employee Service from the employee application
- **Data Composition**: Combines employee data with salary information

## Architecture

The consumer application uses SAP CAPM's service reuse mechanism to consume the Employee Service:

1. **Employee Service**: Deployed as a separate application on BTP CF
2. **Consumer Service**: This application that reuses the employee service
3. **Salary Entity**: New entity that stores salary information

## Service Configuration

The application is configured to reuse the Employee Service through the `package.json`:

```json
"EmployeeService": {
  "kind": "odata"
}
```

The service connection is managed through:

- **MTA Configuration**: Defines the service dependency
- **Destination Service**: Configures the connection to the employee service
- **Service Discovery**: Uses CAPM's built-in service discovery mechanism

## Available Functions

### 1. getEmployeeInfo(employeeNumber)

Retrieves employee information combined with salary details.

**Parameters:**

- `employeeNumber`: String(10) - Employee number

**Returns:**

- Combined employee and salary information

### 2. getAllEmployeesWithSalary()

Retrieves all active employees with their salary information.

**Returns:**

- Array of employees with salary details

## Database Schema

### Salary Entity

- `ID`: UUID (Primary Key)
- `employeeID`: UUID (Foreign Key to Employee)
- `baseSalary`: Decimal(10, 2)
- `bonus`: Decimal(10, 2)
- `allowances`: Decimal(10, 2)
- `effectiveDate`: Date
- `endDate`: Date
- `isActive`: String(10)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Deployment Instructions

### Prerequisites

1. **Employee Application**: Must be deployed and accessible on BTP CF
2. **Destination Service**: Configured to point to the employee service
3. **Authentication**: Proper authentication configured for both applications

### Deployment Steps

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Build the Application:**

   ```bash
   npx cds build
   ```

3. **Deploy to BTP CF:**

   ```bash
   npm run deploy
   ```

4. **Configure Destination Service:**

   Ensure the destination service is configured to point to the employee application URL.

## Testing

Use the provided `test.http` file to test the application:

1. **Get Employee Info with Salary:**

   ```
   GET https://consumer-service.cfapps.sap.hana.ondemand.com/consumer/getEmployeeInfo(employeeNumber='EMP001')
   ```

2. **Get All Employees with Salary:**

   ```
   GET https://consumer-service.cfapps.sap.hana.ondemand.com/consumer/getAllEmployeesWithSalary()
   ```

3. **Get Salaries:**

   ```
   GET https://consumer-service.cfapps.sap.hana.ondemand.com/consumer/Salaries
   ```

## Service Reuse Mechanism

The application demonstrates SAP CAPM's service reuse pattern:

1. **Service Definition**: The Employee Service is defined and deployed as a separate application
2. **Service Consumption**: The consumer application connects to the Employee Service using `cds.connect.to('EmployeeService')`
3. **Data Composition**: Employee data is combined with salary data from the consumer application
4. **Unified Interface**: The consumer service provides a unified interface that combines both services

## Configuration Files

### MTA Configuration (`mta.yaml`)

- Defines the service dependencies
- Configures the destination service
- Sets up proper resource bindings

### Environment Configuration (`default-env.json`)

- Configures the destination service URL
- Sets up authentication forwarding

### Package Configuration (`package.json`)

- Defines the EmployeeService dependency
- Configures service discovery

## Notes

- The consumer application depends on the employee application being deployed and accessible
- Service reuse is achieved through CAPM's built-in service discovery and connection mechanisms
- The application follows SAP CAPM best practices for service composition and reuse
- No local path dependencies are used - all connections are through proper service discovery
