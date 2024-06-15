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
    await sequelize.queryInterface.bulkDelete('MasterIngredients', null, {
        truncate: true, cascade: true, restartIdentity: true
    })
})

describe('POST /inventory/ingredients', () => {

    it('should successfully create an ingredient', async () => {
        const response = await request(app)
            .post('/inventory/ingredients')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                ingredientName: "beras",
                unit: "Kilogram"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: beras');
        expect(response.body.newData).toEqual({
            id: 1,
            ingredientName: "beras",
            unit: "Kilogram",
            updatedBy: "John Wick"
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/inventory/ingredients')
            .send({
                ingredientName: "beras",
                unit: "Kilogram"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if ingredientName field is empty', async () => {
        const response = await request(app)
            .post('/inventory/ingredients')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                ingredientName: "",
                unit: "Kilogram"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Ingredient Name is required');
    });

    it('should fail if unit is an incorrect enum string', async () => {
        const response = await request(app)
            .post('/inventory/ingredients')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                ingredientName: "beras",
                unit: "InvalidUnit"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid input');
    });
});

describe('GET /inventory/ingredients', () => {

    it('should successfully retrieve all ingredients', async () => {
        const response = await request(app)
            .get('/inventory/ingredients')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Master Ingredients');
        expect(response.body.data).toBeInstanceOf(Array);

        response.body.data.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('ingredientName');
            expect(item).toHaveProperty('unit');
            expect(item).toHaveProperty('updatedBy');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/inventory/ingredients');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /inventory/ingredients/:id', () => {
    const validIngredientId = 1;
    const invalidIngredientId = 999;

    it('should successfully retrieve a specific ingredient', async () => {
        const response = await request(app)
            .get(`/inventory/ingredients/${validIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Master Ingredients');
        expect(response.body.data).toEqual({
            id: 1,
            ingredientName: "beras",
            unit: "Kilogram",
            updatedBy: "John Wick"
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/inventory/ingredients/${validIngredientId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the ingredient ID does not exist', async () => {
        const response = await request(app)
            .get(`/inventory/ingredients/${invalidIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidIngredientId + ' not found');
    });
});

describe('PUT /inventory/ingredients/:id', () => {
    const validIngredientId = 1;
    const invalidIngredientId = 999;

    it('should successfully update an ingredient', async () => {
        const response = await request(app)
            .put(`/inventory/ingredients/${validIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                ingredientName: "bawang putih",
                unit: "Gram"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/inventory/ingredients/${validIngredientId}`)
            .send({
                ingredientName: "bawang putih",
                unit: "Gram"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if ingredientName is empty', async () => {
        const response = await request(app)
            .put(`/inventory/ingredients/${validIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                ingredientName: "",
                unit: "Gram"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Ingredient Name is required');
    });

    it('should fail if the ingredient ID does not exist', async () => {
        const response = await request(app)
            .put(`/inventory/ingredients/${invalidIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                ingredientName: "bawang putih",
                unit: "Gram"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidIngredientId + ' not found');
    });
});

describe('DELETE /inventory/ingredients/:id', () => {
    const validIngredientId = 1;
    const invalidIngredientId = 999;

    it('should successfully delete an ingredient', async () => {
        const response = await request(app)
            .delete(`/inventory/ingredients/${validIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted bawang putih');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/inventory/ingredients/${validIngredientId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the ingredient ID does not exist', async () => {
        const response = await request(app)
            .delete(`/inventory/ingredients/${invalidIngredientId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidIngredientId + ' not found');
    });
});
