
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
const app = require('../../index');
let server;

describe('auth middleware', () => {

    beforeEach(() => {
        //app = require('../../index');
    });
    afterEach(async () => {
        
        //await app.close();
        //await Genre.remove({});
    });

    let token;

    const exec = () => {
        return request(app)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name: 'genre1'});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });
    
    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if invalid token', async () => {
        
        const res = await exec();
        expect(res.status).toBe(200);
    });
});