/* * * * * */
/* MODEL: CUSTOMER */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Customer"] Object */
module.exports =
  mongoose.models.Candidate ||
  mongoose.model(
    'Candidate',
    new mongoose.Schema({
      info: {
        name: {
          first: {
            type: String,
            maxlength: 30,
          },
          last: {
            type: String,
            maxlength: 30,
          },
        },
        email: {
          type: String,
          maxlength: 50,
        },
        phone: {
          type: String,
          maxlength: 50,
        },
        tax_id: {
          type: String,
          minlength: 9,
          maxlength: 9,
        },
        message: {
          type: String,
          maxlength: 30,
        },
        birthday: {
          type: String,
          maxlength: 30,
        },
        picture_url: {
          type: String,
          maxlength: 50,
        },
        cv_url: {
          type: String,
          maxlength: 30,
        },
      },
      jobs: [
        {
          type: String,
          maxlength: 30,
        },
      ],
      apply_date: {
        type: String,
        maxlength: 30,
      },
      private: {
        is_favorite: {
          type: Boolean,
        },
        classification: {
          type: String,
          maxlength: 30,
        },
      },
    })
  );
