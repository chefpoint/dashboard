/* * * * * */
/* MODEL: USER */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["User"] Object */
export default mongoose.models.User ||
  mongoose.model(
    'User',
    new mongoose.Schema({
      name: {
        type: String,
        minlength: 2,
        maxlength: 30,
      },
      role: {
        type: String,
        minlength: 2,
        maxlength: 30,
      },
      pwd: {
        type: String,
        minlength: 4,
        maxlength: 4,
      },
    })
  );
