const express = require('express');

const auth = require('../middleware/auth');

const {Customer, validate} = require('../models/customer') 

//setup Schema for genres

// const genreSchema = new mongoose.Schema({
//   _id: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 50
//   }
// });



const router = express.Router();




router.get('/', async (req, res) => {
  

    console.log('GETTING NO ID...');
    const allCustomers = await Customer
    .find()
    .sort('name');

    console.log(allCustomers);
    res.send(allCustomers);


});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  

  const customer = new Customer({
    // _id: async () => {
    //   return await Genre.count() + 1;
    // },
    name: req.body.name,
    phone: req.body.phone
  });
  try{
    const result = await customer.save();
    console.log(`Saving Customer... ${result}`);
  }
  catch(ex){
    for(field in ex.errors){
        console.log(ex.errors[field].message);
    }
  }
  
  //genres.push(genre);
  res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
  //const genre = genres.find(c => c.id === parseInt(req.params.id));


  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,{
    $set: {isGold: req.body.isGold, name: req.body.name, phone: req.body.phone},
    new: true
  });
  console.log(`Updating customer ${customer}`);
  
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  
  
  //genre.name = req.body.name; 
  res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
  

  const customer = await Customer.findByIdAndRemove(req.params.id);
  
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  //const index = genres.indexOf(genre);
  //genres.splice(index, 1);

  res.send(customer);
});

router.get('/:id', async (req, res) => {
    console.log('GETTING WITH ID...');
    const customer = await Customer
      .find({_id: req.params.id});//otherwise return the genre with the ID

  if (!customer) return res.status(404).send('The genre with the given ID was not found.');
  res.send(customer);
});




module.exports = router;

