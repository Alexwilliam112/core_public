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

    const expenseType = [
        {
            name: 'Rental ruko',
            description: ''
        }
    ]

    const routineExp = [
        {
            date: "2024-01-05",
            amount: 12000,
            docStatus: 'Posted',
            description: '',
            TypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'Haji Mamat',
            postedBy: 'John Wick'
        }
    ]

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})
    await sequelize.queryInterface.bulkInsert('ExpenseTypes', expenseType, {})
    await sequelize.queryInterface.bulkInsert('RoutineExpenses', routineExp, {})

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
    await sequelize.queryInterface.bulkDelete('RoutineExpenses', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('ExpenseTypes', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
})

describe('POST /expenses/expenseTypes', () => {

    it('should successfully create an expense type', async () => {
        const response = await request(app)
            .post('/expenses/expenseTypes')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Electricity",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Electricity');
        expect(response.body.newData).toHaveProperty('id');
        expect(response.body.newData).toHaveProperty('name');
        expect(response.body.newData).toHaveProperty('description');
    });

    it('should succeed with an empty description', async () => {
        const response = await request(app)
            .post('/expenses/expenseTypes')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Water",
                description: ""
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Water');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/expenses/expenseTypes')
            .send({
                name: "Electricity",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail with empty name', async () => {
        const response = await request(app)
            .post('/expenses/expenseTypes')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Name is required');
    });
});

describe('GET /expenses/expenseTypes', () => {

    it('should successfully retrieve all expense types', async () => {
        const response = await request(app)
            .get('/expenses/expenseTypes')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Expense Types');
        response.body.data.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('description');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/expenses/expenseTypes');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /expenses/expenseTypes/:id', () => {

    const validExpenseTypeId = 2;
    const invalidExpenseTypeId = 999;

    it('should successfully retrieve a specific expense type', async () => {
        const response = await request(app)
            .get(`/expenses/expenseTypes/${validExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Expense Types');
        expect(response.body.data).toHaveProperty('id', validExpenseTypeId);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('description');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/expenses/expenseTypes/${validExpenseTypeId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the expense type ID does not exist', async () => {
        const response = await request(app)
            .get(`/expenses/expenseTypes/${invalidExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidExpenseTypeId + ' not found');
    });
});

describe('PUT /expenses/expenseTypes/:id', () => {

    const validExpenseTypeId = 2;
    const invalidExpenseTypeId = 999;

    it('should successfully update an expense type', async () => {
        const response = await request(app)
            .put(`/expenses/expenseTypes/${validExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Electricity",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should succeed with an empty description', async () => {
        const response = await request(app)
            .put(`/expenses/expenseTypes/${validExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Electricity",
                description: ""
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/expenses/expenseTypes/${validExpenseTypeId}`)
            .send({
                name: "Electricity",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail with an empty name', async () => {
        const response = await request(app)
            .put(`/expenses/expenseTypes/${validExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Name is required');
    });

    it('should fail if the expense type ID does not exist', async () => {
        const response = await request(app)
            .put(`/expenses/expenseTypes/${invalidExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Electricity",
                description: "pembayaran listrik ruko bulanan"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidExpenseTypeId + ' not found');
    });
});

describe('DELETE /expenses/expenseTypes/:id', () => {

    const validExpenseTypeId = 2;
    const invalidExpenseTypeId = 999;

    it('should successfully delete an expense type', async () => {
        const response = await request(app)
            .delete(`/expenses/expenseTypes/${validExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted Electricity');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/expenses/expenseTypes/${validExpenseTypeId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the expense type ID does not exist', async () => {
        const response = await request(app)
            .delete(`/expenses/expenseTypes/${invalidExpenseTypeId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidExpenseTypeId + ' not found');
    });
});

describe('POST /expenses/routine', () => {

    it('should successfully create a routine expense document', async () => {
        const response = await request(app)
            .post('/expenses/routine')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Routine Expense Document');
        expect(response.body.newData).toHaveProperty('id');
        expect(response.body.newData).toHaveProperty('date');
        expect(response.body.newData).toHaveProperty('amount');
        expect(response.body.newData).toHaveProperty('description');
        expect(response.body.newData).toHaveProperty('TypeId');
        expect(response.body.newData).toHaveProperty('createdBy');
        expect(response.body.newData).toHaveProperty('createdAt');
        expect(response.body.newData).toHaveProperty('updatedAt');
        expect(response.body.newData).toHaveProperty('postedBy');
    });

    it('should succeed without a description', async () => {
        const response = await request(app)
            .post('/expenses/routine')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                TypeId: 1
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.newData).toHaveProperty('id');
        expect(response.body.newData).toHaveProperty('date');
        expect(response.body.newData).toHaveProperty('amount');
        expect(response.body.newData).toHaveProperty('description');
        expect(response.body.newData).toHaveProperty('TypeId');
        expect(response.body.newData).toHaveProperty('createdBy');
        expect(response.body.newData).toHaveProperty('createdAt');
        expect(response.body.newData).toHaveProperty('updatedAt');
        expect(response.body.newData).toHaveProperty('postedBy');
        expect(response.body.message).toBe('Success Create: Routine Expense Document');
    });

    it('should fail with no amount', async () => {
        const response = await request(app)
            .post('/expenses/routine')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Amount is required');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/expenses/routine')
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail with no date', async () => {
        const response = await request(app)
            .post('/expenses/routine')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                amount: 1230000,
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Date is required');
    });

    it('should fail with no TypeId', async () => {
        const response = await request(app)
            .post('/expenses/routine')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Type is required');
    });
});

describe('GET /expenses/routine', () => {

    it('should successfully retrieve all routine expenses', async () => {
        const response = await request(app)
            .get('/expenses/routine')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Routine Expenses');
        expect(response.body.data).toBeInstanceOf(Array);
        response.body.data.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('date');
            expect(item).toHaveProperty('amount');
            expect(item).toHaveProperty('docStatus');
            expect(item).toHaveProperty('description');
            expect(item).toHaveProperty('TypeId');
            expect(item).toHaveProperty('createdBy');
            expect(item).toHaveProperty('createdAt');
            expect(item).toHaveProperty('updatedAt');
            expect(item.ExpenseType).toHaveProperty('name');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/expenses/routine');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /expenses/routine/:id', () => {

    const validRoutineExpenseId = 1;
    const invalidRoutineExpenseId = 999;

    it('should successfully retrieve a specific routine expense document', async () => {
        const response = await request(app)
            .get(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Routine Expenses');
        expect(response.body.data).toHaveProperty('id', validRoutineExpenseId);
        expect(response.body.data).toHaveProperty('date');
        expect(response.body.data).toHaveProperty('amount');
        expect(response.body.data).toHaveProperty('docStatus');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('TypeId');
        expect(response.body.data).toHaveProperty('createdBy');
        expect(response.body.data).toHaveProperty('createdAt');
        expect(response.body.data).toHaveProperty('updatedAt');
        expect(response.body.data.ExpenseType).toHaveProperty('name');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/expenses/routine/${validRoutineExpenseId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the routine expense ID does not exist', async () => {
        const response = await request(app)
            .get(`/expenses/routine/${invalidRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidRoutineExpenseId + ' not found');
    });
});

describe('PUT /expenses/routine/:id', () => {

    const validRoutineExpenseId = 2;
    const postedRoutineExpenseId = 1;

    it('should successfully update a routine expense document', async () => {
        const response = await request(app)
            .put(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum updated",
                TypeId: 1
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should succeed with no description', async () => {
        const response = await request(app)
            .put(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                TypeId: 1
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/expenses/routine/${validRoutineExpenseId}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail with empty amount', async () => {
        const response = await request(app)
            .put(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: '',
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Amount is required');
    });

    it('should fail with empty date', async () => {
        const response = await request(app)
            .put(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: '',
                amount: 1230000,
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Expense Date is required');
    });

    it('should fail when trying to update a POSTED document', async () => {
        const response = await request(app)
            .put(`/expenses/routine/${postedRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                amount: 1230000,
                description: "lorem ipsum",
                TypeId: 1
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });
});

describe('PATCH /expenses/routine/:id', () => {

    const validRoutineExpenseId = 2;
    const postedRoutineExpenseId = 1;
    const invalidUpdateValue = "InvalidStatus";

    it('should successfully update the status of a routine expense document', async () => {
        const response = await request(app)
            .patch(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "On Process" });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document PROCESSED');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .patch(`/expenses/routine/${validRoutineExpenseId}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if updateTo value is incorrect', async () => {
        const response = await request(app)
            .patch(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: invalidUpdateValue });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid input');
    });

    it('should fail when trying to modify a POSTED document', async () => {
        const response = await request(app)
            .patch(`/expenses/routine/${postedRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: "Draft" });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });
});

describe('DELETE /expenses/routine/:id', () => {

    const validRoutineExpenseId = 2;
    const postedRoutineExpenseId = 1;
    const invalidRoutineExpenseId = 999;

    it('should successfully delete a routine expense document', async () => {
        const response = await request(app)
            .delete(`/expenses/routine/${validRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted Document');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/expenses/routine/${validRoutineExpenseId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the routine expense ID does not exist', async () => {
        const response = await request(app)
            .delete(`/expenses/routine/${invalidRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidRoutineExpenseId + ' not found');
    });

    it('should fail when trying to delete a POSTED document', async () => {
        const response = await request(app)
            .delete(`/expenses/routine/${postedRoutineExpenseId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Cannot Modify POSTED Document');
    });
});