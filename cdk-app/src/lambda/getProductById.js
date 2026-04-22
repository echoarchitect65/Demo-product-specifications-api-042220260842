const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

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
        const productId = event.pathParameters?.id;
        
        if (!productId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Product ID is required',
                        timestamp: new Date().toISOString(),
                    },
                }),
            };
        }

        const command = new GetCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                productId: productId,
            },
        });

        const result = await docClient.send(command);
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Product not found',
                        timestamp: new Date().toISOString(),
                    },
                }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Item),
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