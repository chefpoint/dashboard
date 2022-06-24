/* * * * * */
/* MODEL: USER */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["User"] Object */
module.exports =
  mongoose.models.User ||
  mongoose.model(
    'User',
    new mongoose.Schema({
      name: {
        type: String,
        maxlength: 30,
        required: true,
      },
      role: {
        type: String,
        maxlength: 30,
        required: true,
      },
      pwd: {
        type: String,
        maxlength: 4,
        required: true,
      },
    })
  );
