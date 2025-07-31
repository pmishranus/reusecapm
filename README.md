# CAPM Reuse and Compose POC

[![SAP CAP](https://img.shields.io/badge/SAP-CAP%20Framework-blue)](https://cap.cloud.sap.io/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A comprehensive proof-of-concept demonstrating the **reuse and compose** features of SAP BTP Cloud Application Programming Model (CAPM) with two independent MTA applications.

## 🎯 **Project Overview**

This project showcases how to build **independent CAPM applications** that can communicate with each other while maintaining their autonomy and scalability. It demonstrates:

- **Service Reuse**: One application consuming services from another
- **Service Composition**: Building complex business scenarios across applications
- **Independent Deployment**: Each application can be deployed separately
- **Cross-Application Integration**: Real-world service-to-service communication

## 🏗️ **Architecture**

### **Two Independent MTA Applications:**

1. **Employee Master Data Application** (`employee-master/`)
   - **Provides** Employee services via OData
   - **Exposes** Employee, Department, Position entities
   - **Business Actions**: hireEmployee, terminateEmployee, transferEmployee
   - **Deployable** as standalone MTA application

2. **Client Details Application** (`client-details/`)
   - **Consumes** Employee Master Data services
   - **Cross-application** service calls
   - **Business Actions**: createClient, createClientWithEmployee, createProject, assignTeamMember
   - **Deployable** as standalone MTA application

## 📁 **Project Structure**

```
capm-reuse-poc/
├── employee-master/              # Employee Master Data MTA Application
│   ├── mta.yaml                 # MTA deployment descriptor
│   ├── xs-security.json         # XSUAA security configuration
│   ├── package.json             # Application dependencies
│   ├── index.js                 # Application entry point
│   ├── db/
│   │   ├── schema.cds          # Employee data model
│   │   └── data/               # Sample data
│   └── srv/
│       ├── employee-service.cds # Service definition
│       └── employee-service.js  # Service implementation
├── client-details/              # Client Details MTA Application
│   ├── mta.yaml                # MTA deployment descriptor
│   ├── xs-security.json        # XSUAA security configuration
│   ├── package.json            # Application dependencies
│   ├── index.js                # Application entry point
│   ├── db/
│   │   ├── schema.cds         # Client data model
│   │   └── data/              # Sample data
│   ├── srv/
│   │   ├── client-service.cds  # Service definition
│   │   ├── client-service.js   # Service implementation
│   │   ├── dashboard-service.cds # Dashboard service
│   │   └── dashboard-service.js  # Dashboard implementation
│   └── app/
│       ├── index.html          # Main dashboard
│       ├── create-client.html  # Client creation form
│       └── README.md           # Dashboard documentation
├── deploy-employee-master.sh   # Deployment script
├── deploy-client-details.sh    # Deployment script
├── README.md                   # This documentation
└── QUICKSTART.md              # Quick start guide
```

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 16+
- SAP CAP Development Kit
- SAP BTP Cloud Foundry environment (for deployment)

### **Local Development**

1. **Clone the repository**

   ```bash
   git clone https://github.com/pmishranus/reusecapm.git
   cd reusecapm
   ```

2. **Install dependencies**

   ```bash
   # Employee Master Data
   cd employee-master && npm install
   
   # Client Details
   cd client-details && npm install
   ```

3. **Build and deploy to local database**

   ```bash
   # Employee Master Data
   cd employee-master && npm run build && npm run deploy
   
   # Client Details
   cd client-details && npm run build && npm run deploy
   ```

4. **Start the services**

   ```bash
   # Employee Master Data (Terminal 1)
   cd employee-master && npm start
   
   # Client Details (Terminal 2)
   cd client-details && npm start
   ```

5. **Access the applications**
   - **Employee Master Data**: <http://localhost:4004/employee/>
   - **Client Details Dashboard**: <http://localhost:4004/>
   - **Create Client Form**: <http://localhost:4004/create-client.html>

## 🔄 **Reuse and Compose Features**

### **Service Provision (Employee Master Data)**

- **Provides** Employee services via OData
- **Exposes** Employee, Department, Position entities
- **Business Actions**: hireEmployee, terminateEmployee, transferEmployee
- **Deployable** as standalone MTA application

### **Service Consumption (Client Details)**

- **Consumes** Employee Master Data services
- **Cross-application** service calls
- **Business Actions**: createClient, createClientWithEmployee, createProject, assignTeamMember
- **Deployable** as standalone MTA application

### **Cross-Application Integration**

- Client projects can assign employees as account managers
- Project teams can include employees from master data
- Employee data is enriched with client/project context
- **Service-to-service** communication via OData

## 🎯 **Key Business Scenarios**

### **Scenario 1: Employee Management**

1. Hire new employees using the Employee Master service
2. Assign employees to departments and positions
3. Transfer employees between departments

### **Scenario 2: Client Project Management**

1. Create clients with employee account managers
2. Create projects with employee project managers
3. Assign team members to projects
4. Track project status and progress

### **Scenario 3: Cross-Project Integration**

1. Query employees available for project assignments
2. View project teams with employee details
3. Manage client relationships with employee account managers

### **Scenario 4: Employee Creation Chain**

1. Create client with new employee option
2. Employee created in Employee Master Data first
3. Client created only if employee creation succeeds
4. Automatic cleanup if client creation fails

## 🧪 **API Endpoints**

### **Employee Master Data Service**

- `GET /employee/Employees` - List all employees
- `GET /employee/Departments` - List all departments
- `GET /employee/Positions` - List all positions
- `POST /employee/hireEmployee` - Hire a new employee
- `POST /employee/terminateEmployee` - Terminate an employee
- `POST /employee/transferEmployee` - Transfer an employee

### **Client Details Service**

- `GET /client/Clients` - List all clients
- `GET /client/Projects` - List all projects
- `GET /client/Employees` - List all employees (reused)
- `POST /client/createClient` - Create a new client
- `POST /client/createClientWithEmployee` - Create client with employee management
- `POST /client/createProject` - Create a new project
- `POST /client/assignTeamMember` - Assign employee to project

## 🚀 **Deployment**

### **Prerequisites**

- SAP BTP Cloud Foundry environment
- SAP HANA Cloud service
- XSUAA service
- MTA Build Tool (mbt)

### **Deploy to Cloud Foundry**

1. **Deploy Employee Master Data**

   ```bash
   chmod +x deploy-employee-master.sh
   ./deploy-employee-master.sh
   ```

2. **Deploy Client Details**

   ```bash
   chmod +x deploy-client-details.sh
   ./deploy-client-details.sh
   ```

### **Service URLs (Production)**

- **Employee Master Data**: `https://employee-master-srv-<space>.cfapps.sap.hana.ondemand.com/employee/`
- **Client Details**: `https://client-details-srv-<space>.cfapps.sap.hana.ondemand.com/client/`

## 🔧 **Development**

### **Adding Features**

- **Employee Master**: Add new entities/actions
- **Client Details**: Extend with client-specific features
- **Service Contracts**: Maintain backward compatibility

### **Service Discovery**

- Applications discover each other via service bindings
- MTA handles service dependencies automatically
- Cross-application communication via OData

### **Hot Reload**

```bash
cd employee-master && cds watch
cd client-details && cds watch
```

## 📊 **Sample Data**

Both applications include sample data:

- **Employee Master**: 7 employees, 5 departments, 7 positions
- **Client Details**: 5 clients, 5 projects, 5 team assignments

## 🛠 **Technologies Used**

- **SAP CAP**: Cloud Application Programming Model
- **Node.js**: Runtime environment
- **Express**: Web framework
- **SQLite**: Local development database
- **SAP HANA Cloud**: Production database
- **XSUAA**: Authentication and authorization
- **MTA**: Multi-Target Application deployment
- **Bootstrap 5**: Frontend framework
- **OData**: Service communication protocol

## 📚 **References**

- [SAP CAP Documentation](https://cap.cloud.sap.io/)
- [SAP CAP Reuse and Compose](https://cap.cloud.sap.io/docs/guides/extensibility/composition)
- [SAP BTP Cloud Foundry](https://www.sap.com/products/technology-platform.html)
- [MTA Deployment](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4/Cloud/en-US/7c52e5c0bb571014a7b9d2c715a4b3f4.html)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

For questions or issues:

- Create an issue in this repository
- Check the [SAP CAP documentation](https://cap.cloud.sap.io/)
- Review the [QUICKSTART.md](QUICKSTART.md) for detailed instructions

---

**Built with ❤️ using SAP CAP Framework**
