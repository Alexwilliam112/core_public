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

    const transactions = [
        {
            "table": "3",
            "amount": 246000,
            "docStatus": 'Posted',
            "cashier": 'John Wick',
            "createdAt": new Date(),
            "updatedAt": new Date()
        }
    ]

    const trxDetail = [
        {
            "menuName": 'pisang goreng',
            "price": 246000,
            "quantity": 2,
            "SalesId": 1
        }
    ]

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})
    await sequelize.queryInterface.bulkInsert('Sales', transactions, {})
    await sequelize.queryInterface.bulkInsert('SalesDetails', trxDetail, {})

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
    await sequelize.queryInterface.bulkDelete('SalesDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Sales', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
})

describe('POST /operations/sales', () => {

    it('should successfully create a table order', async () => {
        const response = await request(app)
            .post('/operations/sales')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 560000,
                orders: [
                    {
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1
                    },
                    {
                        menuName: "Ayam Goreng",
                        price: 35000,
                        quantity: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: TABLE ORDER: 1');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/operations/sales')
            .send({
                table: "1",
                amount: 560000,
                orders: [
                    {
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1
                    },
                    {
                        menuName: "Ayam Goreng",
                        price: 35000,
                        quantity: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if orders are empty', async () => {
        const response = await request(app)
            .post('/operations/sales')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 560000,
                orders: []
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Please input minimum 1 order');
    });
});

describe('GET /operations/sales', () => {

    it('should successfully retrieve all sales records', async () => {
        const response = await request(app)
            .get('/operations/sales')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Sales');
        expect(response.body.data).toBeInstanceOf(Array);
        response.body.data.forEach(sale => {
            expect(sale).toHaveProperty('id');
            expect(sale).toHaveProperty('table');
            expect(sale).toHaveProperty('amount');
            expect(sale).toHaveProperty('docStatus');
            expect(sale).toHaveProperty('cashier');
            expect(sale).toHaveProperty('createdAt');
            expect(sale).toHaveProperty('updatedAt');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/operations/sales');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /operations/sales/:id', () => {
    const validSalesId = 1;
    const invalidSalesId = 999;

    it('should successfully retrieve a specific sales record', async () => {
        const response = await request(app)
            .get(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Sales');
        expect(response.body.data).toHaveProperty('id', validSalesId);
        expect(response.body.data).toHaveProperty('table');
        expect(response.body.data).toHaveProperty('amount');
        expect(response.body.data).toHaveProperty('docStatus');
        expect(response.body.data).toHaveProperty('cashier');
        expect(response.body.data).toHaveProperty('createdAt');
        expect(response.body.data).toHaveProperty('updatedAt');
        expect(response.body.data.SalesDetails).toBeInstanceOf(Array);
        response.body.data.SalesDetails.forEach(detail => {
            expect(detail).toHaveProperty('id');
            expect(detail).toHaveProperty('menuName');
            expect(detail).toHaveProperty('price');
            expect(detail).toHaveProperty('quantity');
            expect(detail).toHaveProperty('SalesId', validSalesId);
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/operations/sales/${validSalesId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the sales ID does not exist', async () => {
        const response = await request(app)
            .get(`/operations/sales/${invalidSalesId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidSalesId + ' not found');
    });
});

describe('PUT /operations/sales/:id', () => {
    const validSalesId = 2;
    const invalidSalesId = 999;
    const postedSalesId = 1;

    it('should successfully update a sales record', async () => {
        const response = await request(app)
            .put(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 246000,
                orders: [
                    {
                        id: 2,
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1,
                        SalesId: 2
                    },
                    {
                        id: 3,
                        menuName: "Ayam Goreng",
                        price: 35000,
                        quantity: 1,
                        SalesId: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should successfully removed a sales detail record', async () => {
        const response = await request(app)
            .put(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 246000,
                orders: [
                    {
                        id: 2,
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1,
                        SalesId: 2,
                        toDelete: true
                    },
                    {
                        id: 3,
                        menuName: "Ayam Goreng",
                        price: 35000,
                        quantity: 1,
                        SalesId: 2,
                        toDelete: false
                    }
                ]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/operations/sales/${validSalesId}`)
            .send({
                table: "1",
                amount: 246000,
                orders: [
                    {
                        id: 7,
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1,
                        SalesId: 3
                    },
                    {
                        id: 8,
                        menuName: "Ayam Goreng",
                        price: 35000,
                        quantity: 1,
                        SalesId: 3
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if orders array is empty', async () => {
        const response = await request(app)
            .put(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 246000,
                orders: []
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Please input minimum 1 order');
    });

    it('should fail when trying to modify a POSTED document', async () => {
        const response = await request(app)
            .put(`/operations/sales/${postedSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 246000,
                orders: [
                    {
                        id: 7,
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1,
                        SalesId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });

    it('should fail if the sales ID does not exist', async () => {
        const response = await request(app)
            .put(`/operations/sales/${invalidSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                table: "1",
                amount: 246000,
                orders: [
                    {
                        id: 7,
                        menuName: "Nasi Goreng",
                        price: 15000,
                        quantity: 1,
                        SalesId: invalidSalesId
                    }
                ]
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidSalesId + ' not found');
    });
});

describe('PATCH /operations/sales/:id', () => {
    const validSalesId = 2;
    const postedSalesId = 1;

    it('should successfully update the status of a sales document', async () => {
        const response = await request(app)
            .patch(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "On Process" });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document PROCESSED');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .patch(`/operations/sales/${validSalesId}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if updateTo value is an incorrect enum', async () => {
        const response = await request(app)
            .patch(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "Invalid Status" });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid input');
    });

    it('should fail when trying to modify a POSTED document', async () => {
        const response = await request(app)
            .patch(`/operations/sales/${postedSalesId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });
});

describe('DELETE /operations/sales/:id', () => {

    const validSalesId = 2;
    const postedSalesId = 1;
    const invalidSalesId = 999;

    it('should successfully delete a sales transaction', async () => {
        const response = await request(app)
            .delete(`/operations/sales/${validSalesId}`)
            .set('Authorization', `Bearer ${access_token}`);
        console.log(`============= ${response.body.message}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted DRAFT TRANSACTION');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/operations/sales/${validSalesId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the sales ID does not exist', async () => {
        const response = await request(app)
            .delete(`/operations/sales/${invalidSalesId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidSalesId + ' not found');
    });

    it('should fail when trying to delete a POSTED document', async () => {
        const response = await request(app)
            .delete(`/operations/sales/${postedSalesId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });
});