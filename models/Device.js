/* * * * * */
/* MODEL: DEVICE */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Device"] Object */
module.exports =
  mongoose.models.Device ||
  mongoose.model(
    'Device',
    new mongoose.Schema({
      title: {
        type: String,
        maxlength: 30,
        required: true,
      },
      code: {
        type: String,
        maxlength: 6,
        required: true,
        unique: true,
      },
      location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      layout: { type: mongoose.Schema.Types.ObjectId, ref: 'Layout' },
      discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }],
      checking_accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CheckingAccount' }],
    })
  );
