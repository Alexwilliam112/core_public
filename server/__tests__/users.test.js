const request = require('supertest')
const app = require('../app')
const { signToken } = require('../helpers/jwt')
const { hash } = require('../helpers/bcrypt')
const { sequelize } = require('../models/index')

const USER_DATA = {
    ID: '1',
    EMPLOYEENAME: "Haji Mamat",
    USERNAME: 'admin1',
    PASSWORD: '12345',
    ROLE: 'Administrator'
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

describe('GET /admin/users', () => {

    it('should successfully read all users', async () => {
        const response = await request(app)
            .get('/admin/users')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Users');
        expect(response.body.data).toBeInstanceOf(Array);
        response.body.data.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('role');
            expect(user).toHaveProperty('createdAt');
            expect(user).toHaveProperty('updatedAt');
            expect(user).toHaveProperty('Employment');
            expect(user.Employment).toHaveProperty('id');
            expect(user.Employment).toHaveProperty('employeeName');
            expect(user.Employment).toHaveProperty('docStatus');
            expect(user.Employment).toHaveProperty('employmentType');
            expect(user.Employment).toHaveProperty('joinDate');
            expect(user.Employment).toHaveProperty('salary');
            expect(user.Employment).toHaveProperty('bank');
            expect(user.Employment).toHaveProperty('accountNumber');
            expect(user.Employment.Jobtitle).toHaveProperty('jobtitleName');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/admin/users');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /admin/users/:id', () => {
    const validUserId = 2;
    const invalidUserId = 999;

    it('should successfully read the user by id', async () => {
        const response = await request(app)
            .get(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Users');
        expect(response.body.data).toHaveProperty('id', validUserId);
        expect(response.body.data).toHaveProperty('username', 'staff1');
        expect(response.body.data).toHaveProperty('role', 'User');
        expect(response.body.data).toHaveProperty('createdAt');
        expect(response.body.data).toHaveProperty('updatedAt');
        expect(response.body.data).toHaveProperty('Employment');
        expect(response.body.data.Employment).toHaveProperty('employeeName', 'John Wick');
        expect(response.body.data.Employment).toHaveProperty('employmentType', 'Employee');
        expect(response.body.data.Employment).toHaveProperty('joinDate', '2024-05-30');
        expect(response.body.data.Employment).toHaveProperty('salary', 5600000);
        expect(response.body.data.Employment).toHaveProperty('bank', 'BCA');
        expect(response.body.data.Employment).toHaveProperty('accountNumber', '22330209');
        expect(response.body.data.Employment.Jobtitle).toHaveProperty('id', 5);
        expect(response.body.data.Employment.Jobtitle).toHaveProperty('jobtitleName', 'Staff');
    });

    it('should fail with invalid user id', async () => {
        const response = await request(app)
            .get(`/admin/users/${invalidUserId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(`Data with id ${invalidUserId} not found`);
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/admin/users/${validUserId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('POST /admin/users', () => {

    it('should successfully create a user', async () => {
        const response = await request(app)
            .post('/admin/users')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                username: "newuser",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Employee",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 2
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: newuser');
    });

    it('should fail if username already exists', async () => {
        const response = await request(app)
            .post('/admin/users')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                username: "staff1",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Employee",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 2
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Data already exists');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/admin/users')
            .send({
                username: "newuser",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Employee",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 2
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    // Field validation tests
    const fields = ['username', 'password', 'employeeName', 'employmentType',
        'joinDate', 'salary', 'bank', 'accountNumber', 'JobtitleId'];
    fields.forEach(field => {
        it(`should fail if ${field} is missing`, async () => {
            let requestBody = {
                username: "newuser0909",
                password: "12345",
                employeeName: "Test user",
                employmentType: "Employee",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 2
            };

            delete requestBody[field];

            const response = await request(app)
                .post('/admin/users')
                .set('Authorization', `Bearer ${access_token}`)
                .send(requestBody);

            let validationMessage = ''
            switch (field) {
                case 'username': {
                    validationMessage = 'Username is required'
                    break
                }

                case 'password': {
                    validationMessage = 'Password is required'
                    break
                }

                case 'employeeName': {
                    validationMessage = 'Employee Name is required'
                    break
                }

                case 'employmentType': {
                    validationMessage = 'Employment Type is required'
                    break
                }

                case 'joinDate': {
                    validationMessage = 'Join Date is required'
                    break
                }

                case 'salary': {
                    validationMessage = 'Salary amount is required'
                    break
                }

                case 'bank': {
                    validationMessage = 'Bank is required'
                    break
                }

                case 'accountNumber': {
                    validationMessage = 'Bank Account Number is required'
                    break
                }

                case 'JobtitleId': {
                    validationMessage = 'Please select a Jobtitle'
                    break
                }
            }

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe(validationMessage);
        });
    });
});

describe('PATCH /admin/users/:id', () => {
    const validUserId = 1;
    const invalidUserId = 999;

    it('should successfully update user status', async () => {
        const response = await request(app)
            .patch(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: 'Terminated' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document TERMINATED');
    });

    it('should fail when the input is incorrect', async () => {
        const response = await request(app)
            .patch(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: 'InvalidStatus' });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid input');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .patch(`/admin/users/${validUserId}`)
            .send({ updateTo: 'Active' });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the user ID does not exist', async () => {
        const response = await request(app)
            .patch(`/admin/users/${invalidUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({ updateTo: 'Active' });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidUserId + ' not found');
    });
});

describe('PUT /admin/users/:id', () => {
    const validUserId = 1;
    const invalidUserId = 999;

    it('should successfully update a user', async () => {
        const response = await request(app)
            .put(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                username: "staff",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Probation",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 1
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail if joinDate is empty', async () => {
        const response = await request(app)
            .put(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                username: "staff",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Probation",
                joinDate: "",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Join Date is required');
    });

    it('should fail if JobtitleId is empty', async () => {
        const response = await request(app)
            .put(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                username: "staff",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Probation",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: null // Empty JobtitleId
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Please select a Jobtitle');
    });

    it('should fail if the user ID does not exist', async () => {
        const response = await request(app)
            .put(`/admin/users/${invalidUserId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                username: "staff",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Probation",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 1
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(`Data with id ${invalidUserId} not found`);
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/admin/users/${validUserId}`)
            .send({
                username: "staff",
                password: "12345",
                employeeName: "John Cena",
                employmentType: "Probation",
                joinDate: "2024-08-09",
                salary: 120050,
                bank: "BCA",
                accountNumber: "12312311",
                JobtitleId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /admin/auth/:id', () => {
    const validUserId = 5;
    const invalidUserId = 999;

    it('should successfully retrieve authorization details for a user', async () => {
        const response = await request(app)
            .get(`/admin/auth/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`);
        console.log(response.body.auth);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('User_Id');
        expect(response.body).toHaveProperty('auth');
        expect(response.body.auth).toBeInstanceOf(Array);
        expect(response.body.auth.length).toBeGreaterThan(0);
        response.body.auth.forEach(authItem => {
            expect(authItem).toHaveProperty('id');
            expect(authItem).toHaveProperty('authorization');
            expect(authItem).toHaveProperty('value');
            expect(authItem).toHaveProperty('UserId');
        });
    });

    it('should fail if the user ID does not exist', async () => {
        const response = await request(app)
            .get(`/admin/auth/${invalidUserId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id 999 not found');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/admin/auth/${validUserId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('DELETE /admin/users/:id', () => {
    const validUserId = 1;

    it('should fail if the user ID does not exist', async () => {
        const response = await request(app)
            .delete(`/admin/users/999`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id 999 not found');
    });

    it('should successfully delete a user', async () => {
        const response = await request(app)
            .delete(`/admin/users/${validUserId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted USER DOCUMENT');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/admin/users/${validUserId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

