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

    const buyings = require('../data/buyingexpenses.json').map((el) => {
        el.createdAt = el.updatedAt = new Date()
        return el
    })

    const routineExpenses = require('../data/routineexpenses.json').map((el) => {
        el.postedBy = 'Haji Mamat'
        el.createdAt = el.updatedAt = new Date()
        return el
    })

    const payrolls = require('../data/payrollExpenses.json').map((el) => {
        el.createdAt = el.updatedAt = new Date()
        return el
    })

    const sales = require('../data/sales.json').map((el) => {
        el.updatedAt = new Date()
        return el
    })

    const jobtitles = require('../data/jobtitles.json')
    const employments = require('../data/employments.json')
    const buyingDetails = require('../data/buyingdetails.json')
    const expenseTypes = require('../data/expensetypes.json')
    const payrollDetails = require('../data/payrollDetails.json')
    const salesDetails = require('../data/salesdetails.json')

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})
    await sequelize.queryInterface.bulkInsert('Sales', sales, {})
    await sequelize.queryInterface.bulkInsert('SalesDetails', salesDetails, {})
    await sequelize.queryInterface.bulkInsert('ExpenseTypes', expenseTypes, {})
    await sequelize.queryInterface.bulkInsert('RoutineExpenses', routineExpenses, {})
    await sequelize.queryInterface.bulkInsert('PayrollExpenses', payrolls, {})
    await sequelize.queryInterface.bulkInsert('PayrollDetails', payrollDetails, {})
    await sequelize.queryInterface.bulkInsert('Buyings', buyings, {})
    await sequelize.queryInterface.bulkInsert('BuyingDetails', buyingDetails, {})

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
    await sequelize.queryInterface.bulkDelete('SalesDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Sales', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('PayrollDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('PayrollExpenses', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('SalesDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('BuyingDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('SalesDetails', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Buyings', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
})

describe('GET /reports/general', () => {

    test('Success', async () => {
        const response = await request(app)
            .get('/reports/general')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                startDate: '2024-01-01',
                endDate: '2024-05-01'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('KeyTrends');
        expect(response.body).toHaveProperty('Insight');
        expect(response.body).toHaveProperty('Summary');
        expect(response.body).toHaveProperty('Suggestions');
    });

    test('Success with date of 2024-12-01 to 2024-12-31', async () => {
        const response = await request(app)
            .get('/reports/general')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                startDate: '2024-12-01',
                endDate: '2024-12-31'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('KeyTrends');
        expect(response.body).toHaveProperty('Insight');
        expect(response.body).toHaveProperty('Summary');
        expect(response.body).toHaveProperty('Suggestions');
    });

    test('Fail - No Auth', async () => {
        const response = await request(app)
            .get('/reports/general')
            .send({
                startDate: '2024-01-01',
                endDate: '2024-05-01'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized Access. Please LogIn');
    });

    test('Fail - No Date', async () => {
        const response = await request(app)
            .get('/reports/general')
            .set('Authorization', `Bearer ${access_token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid input');
    });

    test('Fail - Empty Date', async () => {
        const response = await request(app)
            .get('/reports/general')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                startDate: '',
                endDate: ''
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid input');
    });

});