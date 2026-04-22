const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const sampleProducts = [
    {
        productName: 'iPhone 15 Pro',
        category: 'Electronics',
        brand: 'Apple',
        specifications: {
            price: 999.99,
            description: 'Latest iPhone with A17 Pro chip',
            features: ['Face ID', '5G', 'Wireless Charging', 'Triple Camera'],
            dimensions: { width: 70.6, height: 146.6, depth: 8.25 },
            weight: 187,
            color: 'Natural Titanium',
            model: 'A3108'
        }
    },
    {
        productName: 'MacBook Air M3',
        category: 'Electronics',
        brand: 'Apple',
        specifications: {
            price: 1299.99,
            description: '13-inch laptop with M3 chip',
            features: ['M3 Chip', 'Retina Display', 'Touch ID', 'All-day Battery'],
            dimensions: { width: 304.1, height: 215, depth: 11.3 },
            weight: 1240,
            color: 'Space Gray',
            model: 'MBA13-M3'
        }
    },
    {
        productName: 'Samsung Galaxy S24 Ultra',
        category: 'Electronics',
        brand: 'Samsung',
        specifications: {
            price: 1199.99,
            description: 'Premium Android smartphone with S Pen',
            features: ['S Pen', '5G', 'AI Camera', '200MP Camera'],
            dimensions: { width: 79, height: 162.3, depth: 8.6 },
            weight: 232,
            color: 'Titanium Black',
            model: 'SM-S928U'
        }
    },
    {
        productName: 'Nike Air Max 270',
        category: 'Clothing',
        brand: 'Nike',
        specifications: {
            price: 150.00,
            description: 'Lifestyle sneakers with Max Air unit',
            features: ['Max Air Cushioning', 'Mesh Upper', 'Rubber Outsole'],
            dimensions: { width: 11, height: 4.5, depth: 13 },
            weight: 350,
            color: 'Black/White',
            model: 'AH8050-002'
        }
    },
    {
        productName: 'Levi\'s 501 Original Jeans',
        category: 'Clothing',
        brand: 'Levi\'s',
        specifications: {
            price: 89.99,
            description: 'Classic straight-leg jeans',
            features: ['100% Cotton', 'Button Fly', 'Straight Leg', 'Original Fit'],
            dimensions: { width: 32, height: 34, depth: 0.5 },
            weight: 600,
            color: 'Dark Stonewash',
            model: '00501-2991'
        }
    },
    {
        productName: 'The Great Gatsby',
        category: 'Books',
        brand: 'Scribner',
        specifications: {
            price: 15.99,
            description: 'Classic American novel by F. Scott Fitzgerald',
            features: ['Paperback', '180 Pages', 'English Language'],
            dimensions: { width: 5.2, height: 8, depth: 0.5 },
            weight: 200,
            color: 'Multi',
            model: 'ISBN-9780743273565'
        }
    },
    {
        productName: 'Atomic Habits',
        category: 'Books',
        brand: 'Avery',
        specifications: {
            price: 18.99,
            description: 'Self-help book by James Clear',
            features: ['Hardcover', '320 Pages', 'English Language', 'Bestseller'],
            dimensions: { width: 6.1, height: 9.3, depth: 1.1 },
            weight: 450,
            color: 'Blue/White',
            model: 'ISBN-9780735211292'
        }
    },
    {
        productName: 'Sony WH-1000XM5',
        category: 'Electronics',
        brand: 'Sony',
        specifications: {
            price: 399.99,
            description: 'Wireless noise-canceling headphones',
            features: ['Active Noise Canceling', 'Bluetooth 5.2', '30-hour Battery', 'Quick Charge'],
            dimensions: { width: 254, height: 192, depth: 80 },
            weight: 250,
            color: 'Black',
            model: 'WH1000XM5/B'
        }
    },
    {
        productName: 'Adidas Ultraboost 22',
        category: 'Clothing',
        brand: 'Adidas',
        specifications: {
            price: 190.00,
            description: 'Premium running shoes with Boost technology',
            features: ['Boost Midsole', 'Primeknit Upper', 'Continental Rubber', 'Energy Return'],
            dimensions: { width: 11.5, height: 4.5, depth: 13.5 },
            weight: 320,
            color: 'Core Black',
            model: 'GZ0127'
        }
    },
    {
        productName: 'Dell XPS 13',
        category: 'Electronics',
        brand: 'Dell',
        specifications: {
            price: 1099.99,
            description: '13-inch ultrabook with Intel Core i7',
            features: ['Intel Core i7', '16GB RAM', '512GB SSD', '4K Display'],
            dimensions: { width: 295.7, height: 198.7, depth: 14.8 },
            weight: 1200,
            color: 'Platinum Silver',
            model: 'XPS9315-7996SLV-PUS'
        }
    }
];

exports.handler = async (event) => {
    console.log('Populating sample data...');
    
    try {
        const promises = sampleProducts.map(async (product) => {
            const productWithId = {
                productId: randomUUID(),
                ...product,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const command = new PutCommand({
                TableName: process.env.DYNAMODB_TABLE_NAME,
                Item: productWithId,
            });

            return docClient.send(command);
        });

        await Promise.all(promises);
        
        console.log(`Successfully populated ${sampleProducts.length} products`);
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully populated ${sampleProducts.length} products`,
                count: sampleProducts.length,
            }),
        };
    } catch (error) {
        console.error('Error populating data:', error);
        throw error;
    }
};