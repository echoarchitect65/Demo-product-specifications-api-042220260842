# Product Specifications API

A comprehensive AWS-based API solution for managing product specifications with DynamoDB backend, built using AWS CDK.

## 🏗️ Architecture

This project implements a serverless API architecture using:
- **AWS Lambda** for API endpoints
- **Amazon DynamoDB** for data storage
- **AWS API Gateway** for REST API management
- **AWS CDK** for Infrastructure as Code

## 📁 Project Structure

```
├── cdk-app/                    # AWS CDK Infrastructure Code
│   ├── lib/                    # CDK Stack definitions
│   ├── src/                    # Lambda function source code
│   ├── test/                   # Unit tests
│   └── bin/                    # CDK app entry point
├── specs/                      # Technical specifications
├── generated-diagrams/         # Architecture diagrams
├── pricing/                    # Cost analysis
├── qr-code/                    # QR codes for quick access
├── jira-stories-summary.md     # User stories and requirements
└── PROJECT_SUMMARY.md          # Complete project overview
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- AWS CLI configured
- AWS CDK CLI installed

### Deployment

1. **Install dependencies**
   ```bash
   cd cdk-app
   npm install
   ```

2. **Deploy infrastructure**
   ```bash
   cdk bootstrap  # First time only
   cdk deploy
   ```

3. **Test the API**
   ```bash
   # API endpoints will be displayed after deployment
   curl https://your-api-gateway-url/products
   ```

## 📊 Features

- **CRUD Operations** for product specifications
- **RESTful API** design
- **Serverless architecture** for cost optimization
- **DynamoDB integration** with sample data
- **Comprehensive testing** suite
- **Infrastructure as Code** with AWS CDK

## 📈 Cost Analysis

Detailed cost breakdowns and optimization recommendations are available in the `pricing/` directory.

## 📋 User Stories

Complete Jira user stories and acceptance criteria are documented in `jira-stories-summary.md`.

## 🔧 Development

### Running Tests
```bash
cd cdk-app
npm test
```

### Local Development
```bash
cd cdk-app
npm run watch  # Watch for changes
```

## 📚 Documentation

- **Technical Specifications**: See `specs/` directory
- **Architecture Diagrams**: See `generated-diagrams/` directory  
- **API Documentation**: Generated after deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.