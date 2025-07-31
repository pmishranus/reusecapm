# CAPM Reuse & Compose Dashboard

This HTML dashboard demonstrates the **reuse and compose** features of SAP BTP CAPM by displaying data from both the **Client Details** and **Employee Master Data** applications.

## 🎯 **Features**

### **Cross-Application Data Integration**

- **Client Details**: Displays clients, projects, and team members
- **Employee Master Data**: Shows available employees and their details
- **Cross-References**: Project managers, account managers, and team members

### **Real-Time Statistics**

- Total Clients
- Active Projects
- Available Employees
- Project Team Members

### **Visual Components**

- **Projects & Team Members**: Shows projects with their managers and team members
- **Clients & Account Managers**: Displays clients with their assigned account managers
- **Available Employees**: Lists all employees from the Employee Master Data service

## 🚀 **Accessing the Dashboard**

### **Local Development**

```bash
cd client-details
npm start
```

Then open: `http://localhost:4004/`

### **Production Deployment**

After deploying the MTA application:

```
https://client-details-srv-<space>.cfapps.sap.hana.ondemand.com/
```

## 🔗 **Service Integration**

### **Dashboard Service** (`/dashboard`)

- `getDashboardData()` - Aggregated data from both services
- `getProjectsWithTeams()` - Projects with team members
- `getClientsWithManagers()` - Clients with account managers

### **Client Service** (`/client`)

- `Clients` - Client entities with account managers
- `Projects` - Project entities with managers and teams
- `ProjectTeamMembers` - Team member assignments

### **Employee Service** (`/employee`)

- `Employees` - Employee entities from Employee Master Data
- `Departments` - Department information
- `Positions` - Position information

## 🎨 **UI Features**

### **Responsive Design**

- Bootstrap 5 framework
- Mobile-friendly layout
- Card-based design

### **Interactive Elements**

- Hover effects on cards
- Real-time data updates
- Loading states and error handling

### **Data Visualization**

- Statistics cards with icons
- Status badges for projects
- Employee avatars with initials
- Color-coded sections

## 🔧 **Technical Implementation**

### **Frontend**

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: ES6+ with async/await
- **Bootstrap 5**: Responsive framework
- **Font Awesome**: Icons

### **Backend Integration**

- **CAPM Services**: OData service consumption
- **Cross-Application Calls**: Employee Master Data service
- **Error Handling**: Graceful fallbacks
- **CORS Support**: Cross-origin requests

## 📊 **Data Flow**

1. **Dashboard Loads** → Calls dashboard service
2. **Dashboard Service** → Aggregates data from both applications
3. **Client Details** → Provides client and project data
4. **Employee Master** → Provides employee data via service consumption
5. **Frontend** → Renders integrated data with statistics

## 🛠 **Development**

### **Adding New Features**

- Extend dashboard service with new actions
- Add new UI components to HTML
- Update JavaScript for new data sources

### **Customization**

- Modify CSS for branding
- Add new data visualizations
- Extend service integration

## 📱 **Browser Support**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔍 **Troubleshooting**

### **Common Issues**

- **CORS Errors**: Check service bindings
- **Data Not Loading**: Verify service availability
- **Authentication**: Ensure proper XSUAA configuration

### **Debug Mode**

Open browser console to see:

- API calls and responses
- Error messages
- Service connection status

## 📚 **Related Documentation**

- [SAP CAP Reuse and Compose](https://cap.cloud.sap/docs/guides/extensibility/composition)
- [SAP BTP Cloud Foundry](https://www.sap.com/products/technology-platform.html)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
