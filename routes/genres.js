const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const {Genre, validate } = require('../models/genre');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');

const router = express.Router();




router.get('/',  async (req, res) => {
  
    //throw new Error('Could not get the genres');
  
    console.log('GETTING NO ID...');
    const allGenres = await Genre
    .find()
    .sort('name');
    //console.log(allGenres);
    res.send(allGenres);
});



router.post('/', auth,  async (req, res) => {

  
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  

  const genre = new Genre({
    // _id: async () => {
    //   return await Genre.count() + 1;
    // },
    name: req.body.name
  });
  try{
    const result = await genre.save();
    console.log(`Saving Genre... ${result}`);
  }
  catch(ex){
    for(field in ex.errors){
        console.log(ex.errors[field].message);
    }
  }
  
  //genres.push(genre);
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  //const genre = genres.find(c => c.id === parseInt(req.params.id));


  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id,{
    $set: {name: req.body.name},
    new: true
  });
  console.log(`Updating genre ${genre}`);
  
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  
  
  //genre.name = req.body.name; 
  res.send(genre);
});

router.delete('/:id', [auth,admin], async (req, res) => {
  

  const genre = await Genre.findByIdAndRemove(req.params.id);
  
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  //const index = genres.indexOf(genre);
  //genres.splice(index, 1);

  res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
    console.log('GETTING WITH ID...');
    
    const genre = await Genre
      .find({_id: req.params.id});//otherwise return the genre with the ID

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});





module.exports = router;

