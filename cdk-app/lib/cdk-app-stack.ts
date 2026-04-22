import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import * as path from 'path';

export class ProductSpecificationsApiStack042220260842 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'ProductSpecificationsTable042220260842', {
      tableName: 'ProductSpecifications042220260842',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Lambda Functions
    const getAllProductsFunction = new lambda.Function(this, 'GetAllProductsFunction042220260842', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getAllProducts.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/lambda')),
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    const getProductByIdFunction = new lambda.Function(this, 'GetProductByIdFunction042220260842', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProductById.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/lambda')),
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Grant permissions
    table.grantReadData(getAllProductsFunction);
    table.grantReadData(getProductByIdFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductSpecificationsApi042220260842', {
      restApiName: 'Product Specifications API 042220260842',
      description: 'API for accessing product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      },
    });

    // API Resources and Methods
    const productsResource = api.root.addResource('products');
    
    // GET /products
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getAllProductsFunction));
    
    // GET /products/{id}
    const productByIdResource = productsResource.addResource('{id}');
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    // Sample Data Population Lambda
    const populateDataFunction = new lambda.Function(this, 'PopulateDataFunction042220260842', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'populateData.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/lambda')),
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 512,
    });

    table.grantWriteData(populateDataFunction);

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB Table Name',
    });

    new cdk.CfnOutput(this, 'PopulateDataFunctionName', {
      value: populateDataFunction.functionName,
      description: 'Populate Data Function Name',
    });
  }
}