/* * * * * */
/* MODEL: CHECKING ACCOUNT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Model for MongoDB ["CheckingAccount"] Object */
export default mongoose.models.CheckingAccount ||
  mongoose.model(
    'CheckingAccount',
    new mongoose.Schema({
      title: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Untitled Checking Account',
      },
      client_name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
      },
      tax_region: {
        type: String,
        minlength: 2,
        maxlength: 2,
        default: 'PT',
      },
      tax_number: {
        type: Number,
        minlength: 9,
        maxlength: 9,
      },
    })
  );
