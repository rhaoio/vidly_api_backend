const express = require('express');
const {Movie } = require('../models/movie');
const {Rental,validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
var Fawn = require('fawn');
const router = express.Router();
const auth = require('../middleware/auth');


Fawn.init('mongodb://localhost/vidly');


router.get('/', async (req, res) => {
  

    console.log('GETTING NO ID...');
    const allRentals = await Rental
    .find()
    .sort('-dateOut');

    console.log(allRentals);
    res.send(allRentals);


});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send('invalid movie.');


  
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('invalid customer.');

  if(movie.numberInStock === 0) return res.status(400).send('Movie out of stock.');

  let rental = new Rental({
    // _id: async () => {
    //   return await Genre.count() + 1;
    // },
    customer: {
        name: customer.name,
        _id: customer._id,
        phone: customer.phone

    },
        
    movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
    },
    
    //rentalFee: movie.dailyRentalRate * 10
    
  });

  

  try{

    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id},{
            $inc: {numberInStock: -1}
        })
        .run();
    

    res.send(rental);
  }
  catch(ex){
    res.status(500).send('Something Failed');
  }
  
  //genres.push(genre);
  res.send(rental);
});

router.put('/:id', auth, async (req, res) => {
  //const genre = genres.find(c => c.id === parseInt(req.params.id));


  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('invalid movie.');


  const rental = await Rental.findByIdAndUpdate(req.params.id,{
    $set: {
        customer:{
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        },
        movie:{
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        dateOut: Date.now,
        rentalFee: movie.dailyRentalRate * 10
        
    },
    new: true
  });
  console.log(`Updating rental ${rental}`);
  
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  
  
  //genre.name = req.body.name; 
  res.send(rental);
});

router.delete('/:id', auth, async (req, res) => {
  

  const rental = await Rental.findByIdAndRemove(req.params.id);
  
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  //const index = genres.indexOf(genre);
  //genres.splice(index, 1);

  res.send(rental);
});

router.get('/:id', async (req, res) => {
    console.log('GETTING WITH ID...');
    const rental = await Rental
      .find({_id: req.params.id});//otherwise return the genre with the ID

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
});





module.exports = router;

