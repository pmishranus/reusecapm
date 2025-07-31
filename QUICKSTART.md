# Quick Start Guide - CAPM Reuse and Compose POC

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
# Employee Master Data
cd employee-master && npm install

# Client Details
cd client-details && npm install
```

### 2. Build and Deploy

```bash
# Employee Master Data
cd employee-master && npm run build && npm run deploy

# Client Details
cd client-details && npm run build && npm run deploy
```

### 3. Start Services

```bash
# Employee Master Data
cd employee-master && npm start

# Client Details (in separate terminal)
cd client-details && npm start
```

### 4. Access the Dashboard

Open your browser and go to:

- **Dashboard**: <http://localhost:4004/>
- **Create Client Form**: <http://localhost:4004/create-client.html>

## 📋 What You'll See

### Employee Master Data Service

- **URL**: <http://localhost:4004/employee/>
- **Entities**: Employees, Departments, Positions
- **Actions**: hireEmployee, terminateEmployee, transferEmployee

### Client Details Service  

- **URL**: <http://localhost:4004/client/>
- **Entities**: Clients, Projects, ProjectTeamMembers, Contacts
- **Reused**: Employees, Departments, Positions (from Employee Master)
- **Actions**: createClient, createClientWithEmployee, createProject, assignTeamMember

## 🔍 Key Features to Explore

### 1. Service Reuse

- Client service can access Employee entities
- Employee business logic is inherited
- Cross-project associations work seamlessly

### 2. Business Actions

- **Employee Master**: Hire, terminate, transfer employees
- **Client Details**: Create clients/projects, assign team members

### 3. Data Relationships

- Clients have account managers (employees)
- Projects have project managers (employees)
- Project teams include employees from master data

### 4. Employee Management

- Create clients with existing employees
- Create clients with new employees (chained process)
- Cross-application employee validation

## 🧪 Sample API Calls

### Employee Service

```bash
# Get all employees
curl http://localhost:4004/employee/Employees

# Hire an employee
curl -X POST http://localhost:4004/employee/hireEmployee \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP008",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@company.com",
    "departmentID": "550e8400-e29b-41d4-a716-446655440001",
    "positionID": "650e8400-e29b-41d4-a716-446655440001"
  }'
```

### Client Service

```bash
# Get all clients
curl http://localhost:4004/client/Clients

# Create a new client with existing employee
curl -X POST http://localhost:4004/client/createClient \
  -H "Content-Type: application/json" \
  -d '{
    "clientNumber": "CLI006",
    "name": "NewTech Solutions",
    "industry": "Technology",
    "accountManagerID": "750e8400-e29b-41d4-a716-446655440002"
  }'

# Create a new client with new employee
curl -X POST http://localhost:4004/client/createClientWithEmployee \
  -H "Content-Type: application/json" \
  -d '{
    "clientNumber": "CLI007",
    "name": "FutureTech Corp",
    "industry": "Technology",
    "createEmployeeIfNotExists": true,
    "employeeData": {
      "employeeNumber": "EMP009",
      "firstName": "Bob",
      "lastName": "Wilson",
      "email": "bob.wilson@company.com",
      "departmentID": "550e8400-e29b-41d4-a716-446655440001",
      "positionID": "650e8400-e29b-41d4-a716-446655440002"
    }
  }'
```

## 🎯 Business Scenarios

### Scenario 1: Employee Management

1. Hire new employees via Employee service
2. Assign to departments and positions
3. Transfer between departments

### Scenario 2: Client Project Management  

1. Create clients with employee account managers
2. Create projects with employee project managers
3. Assign employee team members to projects

### Scenario 3: Cross-Project Integration

1. Query employees available for project assignments
2. View project teams with employee details
3. Manage client-employee relationships

### Scenario 4: Employee Creation Chain

1. Create client with new employee option
2. Employee created in Employee Master Data first
3. Client created only if employee creation succeeds
4. Automatic cleanup if client creation fails

## 🔧 Development

### Adding Features

- **Employee Master**: Add new entities/actions
- **Client Details**: Extend with client-specific features
- **Reuse**: New employee features automatically available

### Hot Reload

```bash
cd employee-master && cds watch
cd client-details && cds watch
```

## 📚 Next Steps

1. **Explore the code**: Check service implementations
2. **Test APIs**: Use the sample calls above
3. **Extend functionality**: Add new business actions
4. **Deploy to BTP**: Configure for production

## 🆘 Troubleshooting

### Common Issues

- **Port conflicts**: Change ports in package.json
- **Database errors**: Delete .db files and redeploy
- **Service not found**: Check cds requires configuration

### Logs

```bash
# View detailed logs
cds watch --debug
```

## 📖 Learn More

- [SAP CAP Documentation](https://cap.cloud.sap.io/)
- [Reuse and Compose Guide](https://cap.cloud.sap.io/docs/guides/reuse-services)
- [SAP BTP Platform](https://www.sap.com/products/technology-platform.html)
