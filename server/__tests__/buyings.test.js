const request = require('supertest')
const app = require('../app')
const { signToken } = require('../helpers/jwt')
const { hash } = require('../helpers/bcrypt')
const { sequelize } = require('../models/index')

const USER_DATA = {
    ID: '2',
    EMPLOYEENAME: "John Wick",
    USERNAME: 'staff1',
    PASSWORD: '12345',
    ROLE: 'User'
}

let access_token
beforeAll(async () => {
    const users = require('../data/users.json')
    users.forEach(el => {
        el.createdAt = el.updatedAt = new Date()
        el.password = hash(el.password)
    });

    const jobtitles = require('../data/jobtitles.json')
    const employments = require('../data/employments.json')

    const buyings = [
        {
            "date": "2024-01-29",
            "amount": 246000,
            "docStatus": "Posted",
            "description": '',
            "createdBy": 'John Wick',
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "postedBy": "John Wick"
        }
    ]

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})
    await sequelize.queryInterface.bulkInsert('Buyings', buyings, {})

    const payload = {
        id: USER_DATA.ID,
        employeeName: USER_DATA.EMPLOYEENAME,
        username: USER_DATA.USERNAME,
        role: USER_DATA.ROLE
    }

    access_token = signToken(payload)
})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Employments', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Jobtitles', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Users', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('MasterIngredients', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Menus', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('BuyingDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Buyings', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
})

describe('POST /expenses/buyings', () => {

    it('should successfully create a buying document', async () => {
        const response = await request(app)
            .post('/expenses/buyings')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram"
                    },
                    {
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Bawang goreng",
                        unit: "Gram"
                    }
                ]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Buying Document');
    });

    it('should succeed with details array empty', async () => {
        const response = await request(app)
            .post('/expenses/buyings')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: []
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Buying Document');
    });

    it('should succeed with empty description', async () => {
        const response = await request(app)
            .post('/expenses/buyings')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "",
                details: [
                    {
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram"
                    }
                ]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Buying Document');
    });

    it('should succeed with amount 0', async () => {
        const response = await request(app)
            .post('/expenses/buyings')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 0,
                description: "lorem ipsum",
                details: [
                    {
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram"
                    }
                ]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Buying Document');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/expenses/buyings')
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram"
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /expenses/buyings', () => {
    test('Success - should respond with 200 and the expected data structure', async () => {
        const response = await request(app)
            .get('/expenses/buyings')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: "Success Read All Document: Buying Expenses",
            data: expect.any(Array)
        });
        expect(response.body.data[0]).toHaveProperty('id');
        expect(response.body.data[0]).toHaveProperty('date');
        expect(response.body.data[0]).toHaveProperty('amount');
        expect(response.body.data[0]).toHaveProperty('docStatus');
        expect(response.body.data[0]).toHaveProperty('description');
        expect(response.body.data[0]).toHaveProperty('createdBy');
        expect(response.body.data[0]).toHaveProperty('postedBy');
        expect(response.body.data[0]).toHaveProperty('createdAt');
        expect(response.body.data[0]).toHaveProperty('updatedAt');
        expect(response.body.data[0]).toHaveProperty('BuyingDetails');
    });

    test('Failure - should respond with 401 if no authorization token is provided', async () => {
        const response = await request(app)
            .get('/expenses/buyings')
            .set('Authorization', '');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: 'Unauthorized Access. Please LogIn'
        });
    });
});

describe('GET /expenses/buyings/:id', () => {
    const validId = 2;
    const invalidId = 999;

    test('Success - should respond with 200 and the expected data structure for valid ID', async () => {
        const response = await request(app)
            .get(`/expenses/buyings/${validId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', "Success Read All Document: Buying Expenses");
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id', validId);
        expect(response.body.data).toHaveProperty('date');
        expect(response.body.data).toHaveProperty('amount');
        expect(response.body.data).toHaveProperty('docStatus');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('createdBy');
        expect(response.body.data).toHaveProperty('postedBy', null);
        expect(response.body.data).toHaveProperty('createdAt');
        expect(response.body.data).toHaveProperty('updatedAt');
        expect(response.body.data).toHaveProperty('BuyingDetails');

        response.body.data.BuyingDetails.forEach(detail => {
            expect(detail).toHaveProperty('id');
            expect(detail).toHaveProperty('quantity');
            expect(detail).toHaveProperty('price');
            expect(detail).toHaveProperty('toDelete', false);
            expect(detail).toHaveProperty('ingredientName');
            expect(detail).toHaveProperty('unit');
            expect(detail).toHaveProperty('toDelete');
            expect(detail).toHaveProperty('ExpenseId', validId);
        });
    });

    test('Failure - should respond with 404 for a non-existing ID', async () => {
        const response = await request(app)
            .get(`/expenses/buyings/${invalidId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', `Data with id ${invalidId} not found`);
    });

    test('Failure - should respond with 401 if no authorization token is provided', async () => {
        const response = await request(app)
            .get(`/expenses/buyings/${validId}`)
            .set('Authorization', '');

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', "Unauthorized Access. Please LogIn");
    });
});

describe('PUT /expenses/buyings/:id', () => {

    const validExpenseId = 2;
    const postedExpenseId = 1;
    const invalidExpenseId = 999;

    it('should successfully update an expense document', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${validExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        ExpenseId: 1
                    },
                    {
                        id: 2,
                        quantity: 10,
                        price: 15200,
                        ingredientName: "Banana",
                        unit: "Piece",
                        ExpenseId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should successfully removed an expense detail item', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${validExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        toDelete: true,
                        ExpenseId: 1
                    },
                    {
                        id: 2,
                        quantity: 10,
                        price: 15200,
                        ingredientName: "Banana",
                        unit: "Piece",
                        toDelete: true,
                        ExpenseId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should succeed with empty details', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${validExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "updated lorem ipsum",
                details: []
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with empty price on detail items', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${validExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 10,
                        price: 0,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        ExpenseId: 1
                    },
                    {
                        id: 2,
                        quantity: 10,
                        price: 15200,
                        ingredientName: "Banana",
                        unit: "Piece",
                        ExpenseId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Price is required');
    });

    it('should fail with empty quantity on detail items', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${validExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 0,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        ExpenseId: 1
                    },
                    {
                        id: 2,
                        quantity: 10,
                        price: 15200,
                        ingredientName: "Banana",
                        unit: "Piece",
                        ExpenseId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Quantity is required');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${validExpenseId}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        ExpenseId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail when trying to modify a POSTED document', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${postedExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        ExpenseId: postedExpenseId
                    }
                ]
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });

    it('should fail if the expense ID does not exist', async () => {
        const response = await request(app)
            .put(`/expenses/buyings/${invalidExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                details: [
                    {
                        id: 1,
                        quantity: 10,
                        price: 5200,
                        ingredientName: "Beras",
                        unit: "Kilogram",
                        ExpenseId: invalidExpenseId
                    }
                ]
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidExpenseId + ' not found');
    });
});

describe('PATCH /expenses/buyings/:id', () => {

    const validBuyingId = 2;
    const postedBuyingId = 1;
    const invalidBuyingId = 999;

    it('should successfully update the status of a buying document', async () => {
        const response = await request(app)
            .patch(`/expenses/buyings/${validBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "On Process" });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document PROCESSED');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .patch(`/expenses/buyings/${validBuyingId}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if updateTo value is incorrect', async () => {
        const response = await request(app)
            .patch(`/expenses/buyings/${validBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "Invalid Status" });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid input');
    });

    it('should fail if the buying ID does not exist', async () => {
        const response = await request(app)
            .patch(`/expenses/buyings/${invalidBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidBuyingId + ' not found');
    });

    it('should fail when trying to modify a POSTED document', async () => {
        const response = await request(app)
            .patch(`/expenses/buyings/${postedBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });
});

describe('DELETE /expenses/buyings/:id', () => {

    const validBuyingId = 2;
    const postedBuyingId = 1;
    const invalidBuyingId = 999;

    it('should successfully delete a buying document', async () => {
        const response = await request(app)
            .delete(`/expenses/buyings/${validBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted Document');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/expenses/buyings/${validBuyingId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail when trying to delete a POSTED document', async () => {
        const response = await request(app)
            .delete(`/expenses/buyings/${postedBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });

    it('should fail if the buying ID does not exist', async () => {
        const response = await request(app)
            .delete(`/expenses/buyings/${invalidBuyingId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidBuyingId + ' not found');
    });
});