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
      name: {
        type: String,
        maxlength: 30,
        required: true,
      },
      location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
      layout: { type: mongoose.Schema.Types.ObjectId, ref: 'Layout' },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    })
  );
