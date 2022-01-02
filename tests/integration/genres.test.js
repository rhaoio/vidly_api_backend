
const request = require('supertest');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
const app = require('../../index');
//let app;

describe('/api/genres', () => {
    beforeEach(() => {
        //app = require('../../index');
        
    });
    afterEach(async () => {
        
        //await app.close();
        await Genre.remove({});
    });
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'Genre1'},
                {name: 'Genre2'},
                {name: 'Genre3'}
            ]);
            const res = await request(app).get('/api/genres');
            expect(res.status).toBe(200);
            
            expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'Genre2')).toBeTruthy();
            
        });

        
        
    });

    describe('GET /id', () => {
        it('should return genre if valid Id is passed', async () => {
            const genre = new Genre({name: 'genre2'});
            await genre.save()
            const res = await request(app).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            
            expect(res.body[0]).toHaveProperty('name', genre.name);
            
            
        });
        it('should return a 404 if invalid Id is passed', async () => {
            //const genre = new Genre({name: 'genre2'});
            //await genre.save()
            const res = await request(app).get('/api/genres/' + 1);
            expect(res.status).toBe(404);
            
            //expect(res.body[0]).toHaveProperty('name', genre.name);
            
            
        });
    });

    describe('POST ', () => {

        let token;

        let name;

        const exec = async () => {
            return await request(app)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name});
        }

        beforeEach(()=> {
            token = new User().generateAuthToken();
            name = 'genre1'
        });

        it('should return 401 if client is not logged in', async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 char', async () => {

            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 char', async () => {

            name = new Array(52).join('a');

            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should save genre if it is valid', async () => {

            

            await exec();

            const genre = await Genre.find({name});
            expect(genre).not.toBeNull();
        });
        
        it('should return genre if it is valid', async () => {

            

            const res = await exec();

            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });

    describe('PUT /id', ()=>{
        let token;

        let name = 'Genre1';

        let _id;

        let post_res;

        const exec_post = async () => {
            
            return await request(app)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name});
        }

        const exec_put = async () => {
            
            return await request(app)
            .put('/api/genres/'+_id)
            .set('x-auth-token', token)
            .send({name});
        }

        beforeEach(async ()=> {
            token = new User().generateAuthToken();
            post_res = await exec_post();
        });

        
        //400 bad request
        it('should return 400 with invalid req.body', async () => {
            
            _id = post_res.body._id;
            
            name = '1234';
            const res = await exec_put();
            expect(res.status).toBe(400);

        });

        //404 id not found
        it('should return 404 with invalid req.id', async () => {
            _id = mongoose.Types.ObjectId();
            
            name = 'Supernatural';
            const res = await exec_put();
            expect(res.status).toBe(404);
        });

        //200 succesful update
        it('should return updated genre with valid Id', async () => {
            _id = post_res.body._id;
            
            name = 'Supernatural';
            const res = await exec_put();
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(name);
        });
    });
});