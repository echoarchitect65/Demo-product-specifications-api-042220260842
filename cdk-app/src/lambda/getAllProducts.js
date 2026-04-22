const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    };

    try {
        const command = new ScanCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
        });

        const result = await docClient.send(command);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                products: result.Items || [],
                count: result.Count || 0,
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Internal server error',
                    timestamp: new Date().toISOString(),
                },
            }),
        };
    }
};