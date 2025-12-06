# Risk Management Tool (RMTool)

A comprehensive web-based Risk Management Tool designed for IT Security and Risk Assessment. This full-stack application helps organizations identify, assess, and manage risks effectively.

## 🚀 Features

### Core Modules

1. **Asset Inventory Management**
   - CRUD operations for organizational assets
   - Categories: Hardware, Software, Data, Personnel, Facilities
   - Criticality ratings (1-5) and value tracking
   - Search and filter capabilities

2. **Threat & Vulnerability Library**
   - Comprehensive threat database
   - Vulnerability tracking system
   - Categorization and management
   - Many-to-many relationship mapping

3. **Risk Assessment & Scoring**
   - Automatic risk score calculation (Likelihood × Impact)
   - Risk classification: Critical (20-25), High (12-19), Medium (6-11), Low (1-5)
   - Real-time risk level determination
   - Detailed risk register with full context

4. **Interactive Risk Matrix**
   - 5×5 heat map visualization
   - Color-coded risk levels
   - Interactive cell selection
   - Risk distribution overview

5. **Risk Treatment Tracking**
   - Four treatment strategies: Mitigate, Accept, Transfer, Avoid
   - Treatment status tracking: Planned, In Progress, Completed
   - Owner assignment and due date management
   - Treatment notes and comments

6. **Comprehensive Dashboard**
   - Real-time statistics and metrics
   - Top 10 highest risks display
   - Treatment progress overview
   - Risk and asset distribution charts

7. **Export & Reporting**
   - **PDF Reports**: Complete risk assessment documentation
   - **Excel Exports**: Detailed data tables for further analysis
   - Ready-to-share professional reports

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **PDFKit** - PDF generation
- **ExcelJS** - Excel file creation

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GadallahYoussef/RMTool.git
   cd RMTool
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for both backend and frontend.

## 🚀 Running the Application

### Development Mode (Recommended)

1. **Start backend server** (Terminal 1)
   ```bash
   npm run start-backend
   ```
   Backend will run on http://localhost:5000

2. **Start frontend development server** (Terminal 2)
   ```bash
   npm run start-frontend
   ```
   Frontend will run on http://localhost:3000

3. **Seed the database with sample data** (Optional)
   ```bash
   npm run seed
   ```

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## 📊 Sample Data

The application includes comprehensive seed data:
- 12 sample assets across different categories
- 15 common threats (malware, phishing, DDoS, etc.)
- 15 vulnerabilities (outdated software, weak passwords, etc.)
- 20 realistic risk scenarios
- 12 sample treatment plans

To populate the database with sample data:
```bash
npm run seed
```

## 🗂️ Project Structure

```
RMTool/
├── backend/                 # Backend application
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   │   ├── riskCalculator.js
│   │   ├── reportGenerator.js
│   │   └── seed.js
│   ├── package.json
│   └── server.js
├── frontend/               # Frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard/
│   │   │   ├── Assets/
│   │   │   ├── Threats/
│   │   │   ├── Vulnerabilities/
│   │   │   ├── Risks/
│   │   │   ├── RiskMatrix/
│   │   │   ├── Treatments/
│   │   │   ├── Reports/
│   │   │   └── common/
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json           # Root package configuration
├── .gitignore
└── README.md
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Create asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

#### Threats
- `GET /api/threats` - Get all threats
- `GET /api/threats/:id` - Get single threat
- `POST /api/threats` - Create threat
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat

#### Vulnerabilities
- `GET /api/vulnerabilities` - Get all vulnerabilities
- `GET /api/vulnerabilities/:id` - Get single vulnerability
- `POST /api/vulnerabilities` - Create vulnerability
- `PUT /api/vulnerabilities/:id` - Update vulnerability
- `DELETE /api/vulnerabilities/:id` - Delete vulnerability

#### Risks
- `GET /api/risks` - Get all risks
- `GET /api/risks/:id` - Get single risk
- `GET /api/risks/stats` - Get risk statistics
- `POST /api/risks` - Create risk (auto-calculates score)
- `PUT /api/risks/:id` - Update risk
- `DELETE /api/risks/:id` - Delete risk

#### Treatments
- `GET /api/treatments` - Get all treatments
- `GET /api/treatments/:id` - Get single treatment
- `GET /api/treatments/stats` - Get treatment statistics
- `POST /api/treatments` - Create treatment
- `PUT /api/treatments/:id` - Update treatment
- `DELETE /api/treatments/:id` - Delete treatment

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

#### Reports
- `GET /api/reports/pdf` - Download PDF report
- `GET /api/reports/excel` - Download Excel export

## 📈 Risk Scoring System

### Likelihood Scale (1-5)
1. **Rare** - May occur only in exceptional circumstances
2. **Unlikely** - Could occur at some time
3. **Possible** - Might occur at some time
4. **Likely** - Will probably occur in most circumstances
5. **Almost Certain** - Expected to occur in most circumstances

### Impact Scale (1-5)
1. **Negligible** - Minimal impact
2. **Minor** - Small impact, easily managed
3. **Moderate** - Noticeable impact requiring management
4. **Major** - Significant impact requiring immediate attention
5. **Catastrophic** - Severe impact with major consequences

### Risk Calculation
```
Risk Score = Likelihood × Impact
```

### Risk Classification
- **Critical**: 20-25 (Red) - Immediate action required
- **High**: 12-19 (Orange) - Urgent attention needed
- **Medium**: 6-11 (Yellow) - Monitor and plan treatment
- **Low**: 1-5 (Green) - Accept or monitor

## 🎯 Usage Guide

### Adding a New Risk

1. Navigate to the **Assets** page and add relevant assets
2. Go to **Threats** page and add applicable threats
3. Visit **Vulnerabilities** page and add relevant vulnerabilities
4. Navigate to **Risks** page and click "Add Risk"
5. Select asset, threat, and vulnerability
6. Set likelihood and impact ratings
7. The system automatically calculates the risk score and level
8. Save the risk

### Creating a Treatment Plan

1. Go to **Treatments** page
2. Click "Add Treatment"
3. Select the risk to treat
4. Choose treatment type (Mitigate/Accept/Transfer/Avoid)
5. Assign owner and set due date
6. Add description and notes
7. Track status as treatment progresses

### Viewing Risk Matrix

1. Navigate to **Risk Matrix** page
2. View color-coded 5×5 matrix
3. Click on any cell to see risks at that likelihood/impact combination
4. Use the matrix for executive presentations

### Generating Reports

1. Go to **Reports** page
2. Click "Download PDF Report" for comprehensive documentation
3. Click "Download Excel File" for data analysis
4. Share reports with stakeholders

## 🔒 Security Considerations

- Input validation on all forms
- SQL injection protection through parameterized queries
- CORS configuration for API security
- Secure file handling for reports
- No sensitive data in client-side code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Developed for IT Security and Risk Management coursework.

## 📧 Support

For issues, questions, or suggestions, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Built for educational purposes in IT Security and Risk Management
- Follows industry-standard risk assessment methodologies
- Designed for practical organizational use
