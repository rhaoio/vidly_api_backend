
const Joi = require('joi');
const express = require('express');
const {Rental } = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');
const validate = require('../middleware/validate');
const router = express.Router();




router.post('/', [auth,validate(validateReturn)], async (req, res) => {
    
    
    

    // if(!req.body.customerId){
    //     res.status(400).send('CustomerId Not provided');
    // }
    // else if(!req.body.movieId){
    //     res.status(400).send('movieId Not provided');
    // }
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    

    const test = await Rental.findOne({
        _id: req.body._id
    });

    if(!rental){
        return res.status(404).send('Rental not found');
    }

    if(rental.dateReturned){
        return res.status(400).send('Rental already returned');
    }
    rental.return();
    
    
    const movie = await Movie.findOne({
        title: rental.movie.title
    });
    await rental.save();

    

    await Movie.updateOne({_id: rental.movie._id},{
        $inc: {numberInStock: 1}
    });

    //movie.numberInStock += 1;
    //await movie.save();
    
    
    return res.send(rental);
    
    
    
    
});

function validateReturn(request){
    //Validate
        const schema = Joi.object({
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
            
        });
    
        return schema.validate(request);
    
    
    }

module.exports = router;