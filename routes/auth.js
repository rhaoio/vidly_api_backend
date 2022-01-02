const express = require('express');

const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user') 
const router = express.Router();


router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if(!user) return res.status(400).send('Invalid Email or Password');


  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid Email or Password');
  
  const token = user.generateAuthToken();
  res.send(token);
 
});

function validate(req){
    //Validate
    const schema = Joi.object({
        email: Joi.string().min(5).max(250).required().email(),
        password: Joi.string().min(1).max(255).required()
    });

    return schema.validate(req);
}




module.exports = router;

