/* * * * * */
/* MODEL: LOCATION */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Location"] Object */
module.exports =
  mongoose.models.Location ||
  mongoose.model(
    'Location',
    new mongoose.Schema({
      title: {
        type: String,
        maxlength: 30,
        required: true,
      },
      apicbase: {
        outlet_id: {
          type: String,
          maxlength: 30,
        },
      },
    })
  );
