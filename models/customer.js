const mongoose = require('mongoose');

const Joi = require('joi');


const Customer = mongoose.model('Customer', new mongoose.Schema({
  
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50
    }
  }));


function validateCustomer(customer){
//Validate
    const schema = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        
        phone: Joi.string().min(1).max(50).required()
    });

    return schema.validate(customer);


}

exports.Customer = Customer;
exports.validate = validateCustomer;