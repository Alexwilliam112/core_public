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

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})

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
})

describe('POST /login', () => {
    it('should login successfully with correct credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: USER_DATA.USERNAME, password: USER_DATA.PASSWORD });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('newUser');
        expect(response.body).toHaveProperty('auth');
        expect(response.body).toHaveProperty('access_token');
    });

    it('should fail with no password provided', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: USER_DATA.USERNAME });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username and Password is required');
    });

    it('should fail with no username provided', async () => {
        const response = await request(app)
            .post('/login')
            .send({ password: USER_DATA.PASSWORD });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Username and Password is required');
    });

    it('should fail with incorrect password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: USER_DATA.USERNAME, password: 'invalidPassword' });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Incorrect Username or Password');
    });

    it('should fail with incorrect username', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'invalidUser', password: USER_DATA.PASSWORD });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Incorrect Username or Password');
    });
});

describe('POST /changePass', () => {
    it('should successfully change password', async () => {
        const response = await request(app)
            .post('/changePass')
            .set('Authorization', `Bearer ${access_token}`)
            .send({ newPassword: 'newValidPassword', repeatPassword: 'newValidPassword' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Successfully Change Password');
    });

    it('should fail if newPassword and repeatPassword are not the same', async () => {
        const response = await request(app)
            .post('/changePass')
            .set('Authorization', `Bearer ${access_token}`)
            .send({ newPassword: 'newValidPassword', repeatPassword: 'differentPassword' });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Retyped password is not the same!');
    });

    it('should fail with no access_token provided', async () => {
        const response = await request(app)
            .post('/changePass')
            .send({ newPassword: 'newValidPassword', repeatPassword: 'newValidPassword' });
        console.log(`==============================${response.body.message}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});