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

describe('GET /admin/jobtitles', () => {

    it('should successfully retrieve all job titles', async () => {
        const response = await request(app)
            .get('/admin/jobtitles')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Jobtitles');
        expect(response.body.data).toBeInstanceOf(Array);
        response.body.data.forEach(jobtitle => {
            expect(jobtitle).toHaveProperty('id');
            expect(jobtitle).toHaveProperty('jobtitleName');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/admin/jobtitles');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /admin/jobtitles/:id', () => {
    const validJobtitleId = 2;
    const invalidJobtitleId = 999;

    it('should successfully retrieve a specific job title', async () => {
        const response = await request(app)
            .get(`/admin/jobtitles/${validJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Jobtitles');
        expect(response.body.data).toHaveProperty('id', validJobtitleId);
        expect(response.body.data).toHaveProperty('jobtitleName', 'Manager');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/admin/jobtitles/${validJobtitleId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the job title ID does not exist', async () => {
        const response = await request(app)
            .get(`/admin/jobtitles/${invalidJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidJobtitleId + ' not found');
    });
});

describe('POST /admin/jobtitles', () => {

    it('should successfully create a job title', async () => {
        const response = await request(app)
            .post('/admin/jobtitles')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                jobtitleName: "Waiter"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Waiter');
    });

    it('should fail if job title name is invalid', async () => {
        const response = await request(app)
            .post('/admin/jobtitles')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                jobtitleName: ""
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Jobtitle name is required');
    });

    it('should fail if job title already exists with name: Manager', async () => {
        const response = await request(app)
            .post('/admin/jobtitles')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                jobtitleName: "Manager"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Data already exists');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/admin/jobtitles')
            .send({
                jobtitleName: "Waiter"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('PUT /admin/jobtitles/:id', () => {
    const validJobtitleId = 2;
    const invalidJobtitleId = 999;

    it('should successfully update a job title', async () => {
        const response = await request(app)
            .put(`/admin/jobtitles/${validJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ jobtitleName: "Courier" });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/admin/jobtitles/${validJobtitleId}`)
            .send({ jobtitleName: "Waiter" });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the job title ID does not exist', async () => {
        const response = await request(app)
            .put(`/admin/jobtitles/${invalidJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ jobtitleName: "Waiter" });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidJobtitleId + ' not found');
    });

    it('should fail if jobtitleName field is empty', async () => {
        const response = await request(app)
            .put(`/admin/jobtitles/${validJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ jobtitleName: "" });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Jobtitle name is required');
    });
});

describe('DELETE /admin/jobtitles/:id', () => {
    const validJobtitleId = 2;
    const invalidJobtitleId = 999;

    it('should successfully delete a job title', async () => {
        const response = await request(app)
            .delete(`/admin/jobtitles/${validJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted Courier');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/admin/jobtitles/${validJobtitleId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the job title ID does not exist', async () => {
        const response = await request(app)
            .delete(`/admin/jobtitles/${invalidJobtitleId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidJobtitleId + ' not found');
    });
});