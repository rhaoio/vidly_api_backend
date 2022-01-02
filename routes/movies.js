const express = require('express');

const {Movie, validate } = require('../models/movie');

const {Genre} = require('../models/genre');

const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  

    console.log('GETTING NO ID...');
    const allMovies = await Movie
    .find()
    .sort('name');

    console.log(allMovies);
    res.send(allMovies);


});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('invalid genre.');
  

  const movie = new Movie({
    // _id: async () => {
    //   return await Genre.count() + 1;
    // },
    title: req.body.title,
    genre: {
        _id: genre._id,
        name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  try{
    const result = await movie.save();
    console.log(`Saving Movie... ${result}`);
  }
  catch(ex){
    for(field in ex.errors){
        console.log(ex.errors[field].message);
    }
  }
  
  //genres.push(genre);
  res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
  //const genre = genres.find(c => c.id === parseInt(req.params.id));


  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('invalid genre.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,{
    $set: { title: req.body.title, 
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
    },
    new: true
  });
  console.log(`Updating movie ${movie}`);
  
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  
  
  //genre.name = req.body.name; 
  res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
  

  const movie = await Movie.findByIdAndRemove(req.params.id);
  
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  //const index = genres.indexOf(genre);
  //genres.splice(index, 1);

  res.send(movie);
});

router.get('/:id', async (req, res) => {
    console.log('GETTING WITH ID...');
    const movie = await Movie
      .find({_id: req.params.id});//otherwise return the genre with the ID

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});





module.exports = router;

