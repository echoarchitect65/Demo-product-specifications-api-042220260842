# AWS Cost Analysis: Product Specifications API

## Executive Summary

This document provides a comprehensive cost analysis for the Product Specifications API project, a serverless application built using AWS Lambda, API Gateway, and DynamoDB. The analysis includes multiple usage scenarios and detailed cost breakdowns for each AWS service.

## Architecture Overview

The Product Specifications API follows a serverless architecture pattern:

- **API Gateway**: REST API entry point with two endpoints
- **AWS Lambda**: Two functions (GetAllProducts, GetProductById) with 256MB memory and 30-second timeout
- **DynamoDB**: Single table (ProductSpecifications) with on-demand billing
- **Region**: US East (N. Virginia)

## Service-by-Service Cost Analysis

### 1. AWS Lambda

**Pricing Model**: On-Demand
- **Requests**: $0.0000002 per request
- **Duration**: Tiered pricing per GB-second
  - Tier 1 (0-6B GB-seconds): $0.0000166667 per GB-second
  - Tier 2 (6B-15B GB-seconds): $0.0000150000 per GB-second
  - Tier 3 (15B+ GB-seconds): $0.0000133334 per GB-second

**Configuration**:
- 2 Lambda functions
- 256MB memory allocation (0.25GB)
- 30-second timeout
- Node.js 18.x runtime

### 2. Amazon API Gateway

**Pricing Model**: REST API On-Demand
- **Tier 1** (0-333M requests/month): $3.50 per million requests
- **Tier 2** (333M-1B requests/month): $2.80 per million requests
- **Tier 3** (1B-20B requests/month): $2.38 per million requests
- **Tier 4** (20B+ requests/month): $1.51 per million requests

**Configuration**:
- REST API (not HTTP API)
- 2 endpoints: GET /products, GET /products/{id}
- No caching enabled
- CORS enabled

### 3. Amazon DynamoDB

**Pricing Model**: On-Demand (Pay-per-request)
- **Read Request Units**: $0.125 per million RRUs
- **Write Request Units**: $0.625 per million WRUs
- **Storage**: $0.25 per GB-month (after 25GB free tier)

**Configuration**:
- Single table: ProductSpecifications
- Primary key: productId (String)
- On-demand billing mode
- No global secondary indexes

## Usage Scenarios and Cost Estimates

### Scenario 1: Low Usage (Development/Testing)
**Monthly Usage**:
- API Requests: 10,000 requests
- Lambda Invocations: 10,000 (average 200ms execution time)
- DynamoDB: 8,000 reads, 2,000 writes
- Storage: 1GB

**Cost Breakdown**:
- **API Gateway**: 10,000 requests × $3.50/million = $0.035
- **Lambda**: 
  - Requests: 10,000 × $0.0000002 = $0.002
  - Duration: 10,000 × 0.2s × 0.25GB × $0.0000166667 = $0.008
- **DynamoDB**:
  - Reads: 8,000 × $0.125/million = $0.001
  - Writes: 2,000 × $0.625/million = $0.001
  - Storage: 1GB × $0.25 = $0.25 (Free tier covers this)
- **Total Monthly Cost**: $0.046

### Scenario 2: Medium Usage (Production - Moderate Load)
**Monthly Usage**:
- API Requests: 1,000,000 requests
- Lambda Invocations: 1,000,000 (average 300ms execution time)
- DynamoDB: 700,000 reads, 300,000 writes
- Storage: 10GB

**Cost Breakdown**:
- **API Gateway**: 1,000,000 requests × $3.50/million = $3.50
- **Lambda**:
  - Requests: 1,000,000 × $0.0000002 = $0.20
  - Duration: 1,000,000 × 0.3s × 0.25GB × $0.0000166667 = $1.25
- **DynamoDB**:
  - Reads: 700,000 × $0.125/million = $0.088
  - Writes: 300,000 × $0.625/million = $0.188
  - Storage: 10GB × $0.25 = $2.50 (Free tier covers first 25GB)
- **Total Monthly Cost**: $7.73

### Scenario 3: High Usage (Production - Heavy Load)
**Monthly Usage**:
- API Requests: 10,000,000 requests
- Lambda Invocations: 10,000,000 (average 400ms execution time)
- DynamoDB: 7,000,000 reads, 3,000,000 writes
- Storage: 50GB

**Cost Breakdown**:
- **API Gateway**: 10,000,000 requests × $3.50/million = $35.00
- **Lambda**:
  - Requests: 10,000,000 × $0.0000002 = $2.00
  - Duration: 10,000,000 × 0.4s × 0.25GB × $0.0000166667 = $16.67
- **DynamoDB**:
  - Reads: 7,000,000 × $0.125/million = $0.875
  - Writes: 3,000,000 × $0.625/million = $1.875
  - Storage: (50GB - 25GB free) × $0.25 = $6.25
- **Total Monthly Cost**: $62.67

### Scenario 4: Enterprise Usage (High-Scale Production)
**Monthly Usage**:
- API Requests: 100,000,000 requests
- Lambda Invocations: 100,000,000 (average 500ms execution time)
- DynamoDB: 70,000,000 reads, 30,000,000 writes
- Storage: 200GB

**Cost Breakdown**:
- **API Gateway**: 100,000,000 requests × $3.50/million = $350.00
- **Lambda**:
  - Requests: 100,000,000 × $0.0000002 = $20.00
  - Duration: 100,000,000 × 0.5s × 0.25GB × $0.0000166667 = $208.33
- **DynamoDB**:
  - Reads: 70,000,000 × $0.125/million = $8.75
  - Writes: 30,000,000 × $0.625/million = $18.75
  - Storage: (200GB - 25GB free) × $0.25 = $43.75
- **Total Monthly Cost**: $649.58

## Cost Summary Table

| Scenario | API Gateway | Lambda | DynamoDB | Total Monthly |
|----------|-------------|---------|----------|---------------|
| Low Usage | $0.035 | $0.010 | $0.002 | $0.047 |
| Medium Usage | $3.50 | $1.45 | $0.276 | $5.23 |
| High Usage | $35.00 | $18.67 | $8.00 | $61.67 |
| Enterprise | $350.00 | $228.33 | $71.25 | $649.58 |

## Cost Optimization Recommendations

### Immediate Optimizations
1. **API Gateway HTTP API**: Consider migrating from REST API to HTTP API for 70% cost reduction ($1.00 vs $3.50 per million requests)
2. **Lambda Memory Optimization**: Monitor actual memory usage and adjust from 256MB if lower usage is observed
3. **DynamoDB Query Optimization**: Implement efficient query patterns to minimize RCU/WCU consumption

### Long-term Optimizations
1. **Reserved Capacity**: For predictable workloads, consider DynamoDB reserved capacity for 53-76% savings
2. **Lambda Provisioned Concurrency**: For consistent traffic patterns, evaluate provisioned concurrency vs cold starts
3. **API Caching**: Implement API Gateway caching for frequently accessed data to reduce Lambda invocations and DynamoDB reads

### Monitoring and Alerting
1. **Cost Budgets**: Set up AWS Budgets with alerts at 50%, 80%, and 100% of expected monthly costs
2. **Usage Monitoring**: Monitor API Gateway request patterns, Lambda duration metrics, and DynamoDB consumption
3. **Right-sizing**: Regular review of Lambda memory allocation and DynamoDB capacity settings

## Assumptions and Exclusions

### Assumptions
- Standard ON DEMAND pricing model
- US East (N. Virginia) region pricing
- No data transfer costs between services (same region)
- Average Lambda execution times as specified per scenario
- No API Gateway caching enabled
- DynamoDB on-demand billing mode
- No reserved capacity or savings plans applied

### Exclusions
- Data transfer costs to/from internet
- CloudWatch Logs storage and monitoring costs
- AWS X-Ray tracing costs (if enabled)
- Development and testing environment costs
- Custom domain and SSL certificate costs
- Backup and disaster recovery costs
- Support plan costs

## Free Tier Benefits

### AWS Lambda
- 1 million free requests per month
- 400,000 GB-seconds of compute time per month

### Amazon DynamoDB
- 25 GB of storage per month
- 25 provisioned Write Capacity Units (WCU)
- 25 provisioned Read Capacity Units (RCU)
- 2.5 million stream read requests per month

### API Gateway
- No free tier for REST API
- HTTP API offers 1 million requests free for first 12 months

## Conclusion

The Product Specifications API demonstrates excellent cost efficiency for serverless applications, with costs scaling linearly with usage. The low-usage scenario costs less than $0.05 per month, making it ideal for development and testing. Production workloads show reasonable costs with the medium usage scenario at approximately $5.23 per month.

For high-scale enterprise usage, the primary cost driver is API Gateway, representing 54% of total costs. Consider migrating to HTTP API or implementing caching strategies for significant cost reductions.

The serverless architecture provides excellent cost optimization through pay-per-use pricing, eliminating fixed infrastructure costs and providing automatic scaling capabilities.