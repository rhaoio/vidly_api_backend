const {Rental} = require('../../models/rental');
const {Genre} = require('../../models/genre');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

const app = require('../../index');

describe('/api/returns', () => {

    let customerId;
    let movieId;
    let rental;
    let token;
    let genreId;
    
    let genre;
    let movie;


    const exec = () => {
        return request(app)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});
    }

    beforeEach(async () => {
        // server = require('../../index');
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
        genreId = mongoose.Types.ObjectId();
        genre = new Genre({
            _id: genreId,
            name: "TestGenre"
        });
        rental = new Rental({
            customer: {
                _id: customerId,
                name: "ABCDE",
                phone: "12345"
            },
            movie: {
                _id: movieId,
                title: "TestTitle",
                dailyRentalRate: 2
            }
        });
        movie = new Movie({
            _id: movieId,
            title: "TestTitle",
            genre: {name: "GENRETEST"},
            numberInStock: 0,
            dailyRentalRate: 2
        });
        await genre.save();
        await rental.save();
        await movie.save();
    });
    afterEach(async () => {
        
        //server.close();
        //await Genre.remove({});
        await Rental.remove({});
        await Movie.remove({});
        await Genre.remove({});
    });

    it('should return 401 if client is not logged in!', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if customerId/movieId combination is not found', async () => {
        
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental has already been returned', async () => {
        
        rental.dateReturned = new Date();

        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if there is a valid request', async () => {
        
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it('set the return date if input is valid', async () => {
        
        

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10*1000);
    });
    it('set rentalFee if input is valid', async () => {
        
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        //const rentalFee = await (rentalInDb.dateReturned - rentalInDb.dateOut) *86400000* rentalInDb.movie.dailyRentalRate;

        expect(rentalInDb.rentalFee).toBeCloseTo (14);
    });
    it('increase movie stock if input is valid', async () => {
        
        

        const res = await exec();
        const movieInDb = await Movie.findOne({title: rental.movie.title});
        console.log(movie);

        //const rentalFee = await (rentalInDb.dateReturned - rentalInDb.dateOut) *86400000* rentalInDb.movie.dailyRentalRate;

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    it('should return the rental in res.body', async () => {

        const res = await exec();

        const rentalInDb = Rental.findById({_id: rental._id});

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut','dateReturned','customer','movie']));
    });
});