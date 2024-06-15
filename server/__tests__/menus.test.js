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
    const ingredients = [
        {
            ingredientName: 'bawang goreng',
            unit: 'Gram',
            updatedBy: 'tesUser'
        }
    ]

    await sequelize.queryInterface.bulkInsert('Users', users, {})
    await sequelize.queryInterface.bulkInsert('Jobtitles', jobtitles, {})
    await sequelize.queryInterface.bulkInsert('Employments', employments, {})
    await sequelize.queryInterface.bulkInsert('MasterIngredients', ingredients, {})

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
})

describe('POST /inventory/menus', () => {

    it('should successfully create a menu item', async () => {
        const response = await request(app)
            .post('/inventory/menus')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi Goreng",
                price: 56000,
                ingredients: [
                    {
                        quantity: 2,
                        IngredientId: 1
                    }
                ]
            });
        console.log(response.body.message);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Nasi Goreng');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .post('/inventory/menus')
            .send({
                name: "Nasi Goreng",
                price: 56000,
                ingredients: [
                    {
                        quantity: 2,
                        IngredientId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('it should successfully create with no ingredients', async () => {
        const response = await request(app)
            .post('/inventory/menus')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi uduk",
                price: 56000,
                ingredients: []
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Success Create: Nasi uduk');
    });

    it('should fail with empty price', async () => {
        const response = await request(app)
            .post('/inventory/menus')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi Goreng",
                price: "",
                ingredients: [
                    {
                        quantity: 2,
                        IngredientId: 1
                    }
                ]
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Menu Price is required');
    });

});

describe('GET /inventory/menus', () => {

    it('should successfully retrieve all menu items', async () => {
        const response = await request(app)
            .get('/inventory/menus')
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Menus');
        response.body.data.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('updatedBy');
            expect(item).toHaveProperty('createdAt');
            expect(item).toHaveProperty('updatedAt');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get('/inventory/menus');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });
});

describe('GET /inventory/menus/:id', () => {
    const validMenuId = 2;
    const invalidMenuId = 999;

    it('should successfully retrieve a specific menu item', async () => {
        const response = await request(app)
            .get(`/inventory/menus/${validMenuId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success Read All Document: Menus');
        expect(response.body.data).toHaveProperty('id', validMenuId);
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('price');
        expect(response.body.data.MenuIngredients).toBeInstanceOf(Array);
        response.body.data.MenuIngredients.forEach(ingredient => {
            expect(ingredient).toHaveProperty('id');
            expect(ingredient).toHaveProperty('quantity');
            expect(ingredient).toHaveProperty('toDelete', false);
            expect(ingredient).toHaveProperty('Ingredients');
            expect(ingredient.Ingredients).toHaveProperty('id');
            expect(ingredient.Ingredients).toHaveProperty('ingredientName');
            expect(ingredient.Ingredients).toHaveProperty('unit');
        });
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .get(`/inventory/menus/${validMenuId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the menu ID does not exist', async () => {
        const response = await request(app)
            .get(`/inventory/menus/${invalidMenuId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidMenuId + ' not found');
    });
});

describe('PUT /inventory/menus/:id', () => {
    const validMenuId = 2;
    const invalidMenuId = 999;

    it('should successfully update a menu item', async () => {
        const response = await request(app)
            .put(`/inventory/menus/${validMenuId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi Gorengs",
                price: 56000,
                ingredients: [
                    {
                        id: 3,
                        quantity: 2,
                        IngredientId: 1,
                        MenuId: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should successfully removed an ingredient item', async () => {
        const response = await request(app)
            .put(`/inventory/menus/${validMenuId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi Gorengs",
                price: 56000,
                ingredients: [
                    {
                        id: 3,
                        quantity: 2,
                        toDelete: true,
                        IngredientId: 1,
                        MenuId: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Document Updated');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .put(`/inventory/menus/${validMenuId}`)
            .send({
                name: "Nasi Goreng",
                price: 56000,
                ingredients: [
                    {
                        id: 2,
                        quantity: 2,
                        IngredientId: 1,
                        MenuId: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the menu ID does not exist', async () => {
        const response = await request(app)
            .put(`/inventory/menus/${invalidMenuId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi Goreng",
                price: 56000,
                ingredients: [
                    {
                        id: 3,
                        quantity: 2,
                        IngredientId: 4,
                        MenuId: 2
                    },
                    {
                        id: 4,
                        quantity: 2,
                        IngredientId: 6,
                        MenuId: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidMenuId + ' not found');
    });

    it('should fail if quantity is empty', async () => {
        const response = await request(app)
            .put(`/inventory/menus/${validMenuId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                name: "Nasi Gorengs",
                price: 56000,
                ingredients: [
                    {
                        id: 3,
                        quantity: "",
                        IngredientId: 1,
                        MenuId: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Quantity is required');
    });
});

describe('DELETE /inventory/menus/:id', () => {
    const validMenuId = 1;
    const invalidMenuId = 999;

    it('should successfully delete a menu item', async () => {
        const response = await request(app)
            .delete(`/inventory/menus/${validMenuId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Deleted Nasi Goreng');
    });

    it('should fail with no auth bearer token', async () => {
        const response = await request(app)
            .delete(`/inventory/menus/${validMenuId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Unauthorized Access. Please LogIn');
    });

    it('should fail if the menu ID does not exist', async () => {
        const response = await request(app)
            .delete(`/inventory/menus/${invalidMenuId}`)
            .set('Authorization', `Bearer ${access_token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Data with id ' + invalidMenuId + ' not found');
    });
});