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

    const payroll = [
        {
            "amount": 5615200,
            "docStatus": "Posted",
            "description": "lorem ipsum",
            "createdBy": "Haji Mamat",
            "postedBy": "Haji Mamat",
            "date": "2024-01-01",
            "createdAt": "2024-06-10",
            "updatedAt": "2024-06-11",
        }
    ]

    const payrollDetail = [
        {
            "employeeName": "John Wick",
            "salaryPaid": 5600000,
            "bank": "BCA",
            "accountNumber": "22330209",
            "EmploymentId": 2,
            "PayId": 1
        }
    ]

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})
    await sequelize.queryInterface.bulkInsert('PayrollExpenses', payroll, {})
    await sequelize.queryInterface.bulkInsert('PayrollDetails', payrollDetail, {})

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
    await sequelize.queryInterface.bulkDelete('PayrollDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('PayrollExpenses', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
})

describe('POST /expenses/payroll', () => {

    it('should succeed with valid data and authorization', async () => {
        const response = await request(app)
            .post('/expenses/payroll')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                description: "lorem ipsum"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Success Create: PayrollExpense Document');
        expect(response.body).toHaveProperty('newData');
        expect(response.body.newData).toHaveProperty('id');
        expect(response.body.newData).toHaveProperty('date');
        expect(response.body.newData).toHaveProperty('amount');
        expect(response.body.newData).toHaveProperty('docStatus', 'Draft');
        expect(response.body.newData).toHaveProperty('description');
        expect(response.body.newData).toHaveProperty('createdBy');
        expect(response.body.newData).toHaveProperty('postedBy', null);
        expect(response.body.newData).toHaveProperty('createdAt');
        expect(response.body.newData).toHaveProperty('updatedAt');
    });

    it('should succeed with EMPTY description', async () => {
        const response = await request(app)
            .post('/expenses/payroll')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "2024-01-01",
                description: ""
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Success Create: PayrollExpense Document');
        expect(response.body).toHaveProperty('newData');
        expect(response.body.newData).toHaveProperty('id');
        expect(response.body.newData).toHaveProperty('date');
        expect(response.body.newData).toHaveProperty('amount');
        expect(response.body.newData).toHaveProperty('docStatus', 'Draft');
        expect(response.body.newData).toHaveProperty('description');
        expect(response.body.newData).toHaveProperty('createdBy');
        expect(response.body.newData).toHaveProperty('postedBy', null);
        expect(response.body.newData).toHaveProperty('createdAt');
        expect(response.body.newData).toHaveProperty('updatedAt');
    });

    it('should fail when date is empty', async () => {
        const response = await request(app)
            .post('/expenses/payroll')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                date: "",
                description: "lorem ipsum"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Payroll Date is required');
    });

    it('should fail when no authorization is provided', async () => {
        const response = await request(app)
            .post('/expenses/payroll')
            .send({
                date: "2024-01-01",
                description: "lorem ipsum"
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });
});

describe('GET /expenses/payroll', () => {

    it('should succeed with valid authorization', async () => {
        const response = await request(app)
            .get('/expenses/payroll')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Success Read All Document: Payroll Expenses');
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        response.body.data.forEach(expense => {
            expect(expense).toHaveProperty('id');
            expect(expense).toHaveProperty('date');
            expect(expense).toHaveProperty('amount');
            expect(expense).toHaveProperty('docStatus');
            expect(expense).toHaveProperty('description');
            expect(expense).toHaveProperty('createdBy');
            expect(expense).toHaveProperty('postedBy');
            expect(expense).toHaveProperty('createdAt');
            expect(expense).toHaveProperty('updatedAt');
        });
    });

    it('should fail when no authorization is provided', async () => {
        const response = await request(app)
            .get('/expenses/payroll');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });
});

describe('GET /expenses/payroll/:id', () => {
    const validId = 2;
    const invalidId = 999;

    it('should successfully read specified details', async () => {
        const response = await request(app)
            .get(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Success Read All Document: Payroll Expenses');
        expect(response.body).toHaveProperty('data');
        const expense = response.body.data;
        expect(expense).toHaveProperty('id', validId);
        expect(expense).toHaveProperty('date');
        expect(expense).toHaveProperty('amount');
        expect(expense).toHaveProperty('docStatus');
        expect(expense).toHaveProperty('description');
        expect(expense).toHaveProperty('createdBy');
        expect(expense).toHaveProperty('postedBy');
        expect(expense).toHaveProperty('createdAt');
        expect(expense).toHaveProperty('updatedAt');
        expect(expense).toHaveProperty('PayrollDetails');
        expect(Array.isArray(expense.PayrollDetails)).toBe(true);
        expense.PayrollDetails.forEach(detail => {
            expect(detail).toHaveProperty('id');
            expect(detail).toHaveProperty('employeeName');
            expect(detail).toHaveProperty('salaryPaid');
            expect(detail).toHaveProperty('EmploymentId');
            expect(detail).toHaveProperty('PayId');
            expect(detail).toHaveProperty('toDelete');
        });
    });

    it('should fail when no authorization is provided', async () => {
        const response = await request(app)
            .get(`/expenses/payroll/${validId}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });

    it('should fail when ID is not found', async () => {
        const response = await request(app)
            .get(`/expenses/payroll/${invalidId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', `Data with id ${invalidId} not found`);
    });
});

describe('PUT /expenses/payroll/:id', () => {

    const validId = 2;
    const invalidId = 999;
    const postedId = 1;

    const validPayload = {
        date: "2024-01-01",
        amount: 1230000,
        description: "lorem ipsum",
        details: [
            {
                id: 3,
                employeeName: "Haji Mamat",
                salaryPaid: 0,
                bank: "BCA",
                accountNumber: "12001291",
                EmploymentId: 1,
                PayId: 2,
                toDelete: true
            },
            {
                id: 4,
                employeeName: "John Wick",
                salaryPaid: 5600000,
                bank: "BCA",
                accountNumber: "22330209",
                EmploymentId: 2,
                PayId: 2,
                toDelete: false
            },
            {
                id: 5,
                employeeName: "Gerard Butler",
                salaryPaid: 15200,
                bank: "BCA",
                accountNumber: "12390101",
                EmploymentId: 3,
                PayId: 2,
                toDelete: false
            }
        ]
    };

    it('should succeed with valid authorization and valid ID', async () => {
        const response = await request(app)
            .put(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(validPayload);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Document Updated');
    });

    it('should fail when no authorization is provided', async () => {
        const response = await request(app)
            .put(`/expenses/payroll/${validId}`)
            .send(validPayload);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });

    it('should fail when ID is not found', async () => {
        const response = await request(app)
            .put(`/expenses/payroll/${invalidId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(validPayload);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', `Data with id ${invalidId} not found`);
    });

    it('should fail when attempting to edit a posted document', async () => {
        const response = await request(app)
            .put(`/expenses/payroll/${postedId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(validPayload);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Cannot Modify POSTED Document');
    });

    it('should fail when BANK property is empty in details array', async () => {
        const invalidPayload = {
            ...validPayload,
            details: [
                {
                    id: 5,
                    employeeName: "Haji Mamat",
                    salaryPaid: 12000,
                    bank: "",
                    accountNumber: "12001291",
                    EmploymentId: 1,
                    PayId: 5,
                    toDelete: false
                }
            ]
        };

        const response = await request(app)
            .put(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Bank Name is required');
    });

    it('should fail when BANK property is empty in details array', async () => {
        const invalidPayload = {
            ...validPayload,
            details: [
                {
                    id: 5,
                    employeeName: "Haji Mamat",
                    salaryPaid: 12000,
                    bank: "BRI",
                    accountNumber: "",
                    EmploymentId: 1,
                    PayId: 5,
                    toDelete: false
                }
            ]
        };

        const response = await request(app)
            .put(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Account Number is required');
    });

    it('should fail when BANK property is empty in details array', async () => {
        const invalidPayload = {
            ...validPayload,
            details: [
                {
                    id: 5,
                    employeeName: "",
                    salaryPaid: 120000,
                    bank: "BRI",
                    accountNumber: "12001291",
                    EmploymentId: 1,
                    PayId: 5,
                    toDelete: false
                }
            ]
        };

        const response = await request(app)
            .put(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Employee Name is required');
    });

    it('should fail when BANK property is empty in details array', async () => {
        const invalidPayload = {
            ...validPayload,
            details: [
                {
                    id: 5,
                    employeeName: "Haji Mamat",
                    salaryPaid: 0,
                    bank: "BNI",
                    accountNumber: "12001291",
                    EmploymentId: 1,
                    PayId: 5,
                    toDelete: false
                }
            ]
        };

        const response = await request(app)
            .put(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Salary Paid is required');
    });
});

describe('PATCH /expenses/payroll/:id', () => {

    const validId = 2;
    const invalidId = 999;
    const postedId = 1;

    const validPayload = {
        updateTo: "On Process"
    };

    const invalidPayloadEnum = {
        updateTo: "InvalidStatus"
    };

    it('should succeed with valid authorization and valid ID', async () => {
        const response = await request(app)
            .patch(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(validPayload);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', `Document PROCESSED`);
    });

    it('should fail when no authorization is provided', async () => {
        const response = await request(app)
            .patch(`/expenses/payroll/${validId}`)
            .send(validPayload);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });

    it('should fail when ID is not found', async () => {
        const response = await request(app)
            .patch(`/expenses/payroll/${invalidId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(validPayload);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', `Data with id ${invalidId} not found`);
    });

    it('should fail when attempting to modify a posted document', async () => {
        const response = await request(app)
            .patch(`/expenses/payroll/${postedId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(validPayload);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Cannot Modify POSTED Document');
    });

    it('should fail when updateTo has an incorrect enum value', async () => {
        const response = await request(app)
            .patch(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send(invalidPayloadEnum);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid input');
    });
});

describe('DELETE /expenses/payroll/:id', () => {

    const validId = 2;
    const invalidId = 999;
    const postedId = 1;

    it('should succeed with valid authorization and valid ID', async () => {
        const response = await request(app)
            .delete(`/expenses/payroll/${validId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Deleted Document');
    });

    it('should fail when no authorization is provided', async () => {
        const response = await request(app)
            .delete(`/expenses/payroll/${validId}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });

    it('should fail when ID is not found', async () => {
        const response = await request(app)
            .delete(`/expenses/payroll/${invalidId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', `Data with id ${invalidId} not found`);
    });

    it('should fail when attempting to delete a posted document', async () => {
        const response = await request(app)
            .delete(`/expenses/payroll/${postedId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Cannot Modify POSTED Document');
    });
});