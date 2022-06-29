/* * * * * */
/* MODEL: CHECKING ACCOUNT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["CheckingAccount"] Object */
module.exports =
  mongoose.models.CheckingAccount ||
  mongoose.model(
    'CheckingAccount',
    new mongoose.Schema({
      title: {
        type: String,
        maxlength: 30,
        required: true,
      },
      client_name: {
        type: String,
      },
      tax_country: {
        type: String,
        minlength: 2,
        maxlength: 2,
        default: 'PT',
      },
      tax_number: {
        type: String,
        minlength: 9,
        maxlength: 9,
      },
    })
  );
