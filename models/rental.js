const Joi = require('joi');

const string = require('joi/lib/types/string');
const {movieSchema} = require('./movie');


//mongoose
const mongoose = require('mongoose');

//Setup a mongoose Model - object of schema

const rentalSchema = new mongoose.Schema({
  customer:{ type: new mongoose.Schema({
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
  
    }),
    required: true
      
    },
    movie: {type: new mongoose.Schema({
      title: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 250
        },
       
        dailyRentalRate: {
            type: Number,
            min: 0,
            max:1000,
            required: true
        }
    }),
    required: true
  },
  dateOut:{
      type: Date,
      required:true,
      default: Date.now
  },
  dateReturned: {
      type: Date
  },
  rentalFee:{
      type: Number,
      min: 0
  }
 
});

rentalSchema.statics.lookup = function(customerId, movieId){
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
});
};


rentalSchema.methods.return = function(){
    this.dateReturned = new Date();
    this.rentalFee = ((this.dateReturned - this.dateOut)/86400000)* this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
//Validate
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    
    if(!mongoose.Types.ObjectId.isValid(req.body.customerId)) 
    return res.status(400).send('Invalid Customer.');

    return schema.validate(rental);


}

exports.Rental = Rental;
exports.validate = validateRental;
