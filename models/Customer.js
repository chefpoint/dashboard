/* * * * * */
/* MODEL: CUSTOMER */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Customer"] Object */
module.exports =
  mongoose.models.Customer ||
  mongoose.model(
    'Customer',
    new mongoose.Schema({
      first_name: {
        type: String,
        minlength: 2,
        maxlength: 30,
      },
      last_name: {
        type: String,
        maxlength: 30,
      },
      tax_region: {
        type: String,
        maxlength: 2,
      },
      tax_number: {
        type: Number,
        maxlength: 9,
      },
      contact_email: {
        type: String,
        maxlength: 50,
      },
      send_invoices: {
        type: Boolean,
        default: true,
      },
      reference: {
        type: String,
        maxlength: 30,
      },
      birthday: {
        type: String,
        maxlength: 30,
      },
    })
  );
