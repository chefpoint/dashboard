/* * * * * */
/* MODEL: DAY */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Day"] Object */
module.exports =
  mongoose.models.Day ||
  mongoose.model(
    'Day',
    new mongoose.Schema({
      date: {
        type: String,
        maxlength: 50,
        unique: true,
      },
      is_public: {
        type: Boolean,
      },
      special_day: {
        icon: {
          type: String,
          maxlength: 500,
        },
        label: {
          type: String,
          maxlength: 500,
        },
      },
      dishes: {
        vegan: {
          apicbase_id: {
            type: String,
            maxlength: 500,
          },
          apicbase_url: {
            type: String,
            maxlength: 500,
          },
          title_pt: {
            type: String,
            maxlength: 500,
          },
          title_en: {
            type: String,
            maxlength: 500,
          },
        },
        fish: {
          apicbase_id: {
            type: String,
            maxlength: 500,
          },
          apicbase_url: {
            type: String,
            maxlength: 500,
          },
          title_pt: {
            type: String,
            maxlength: 500,
          },
          title_en: {
            type: String,
            maxlength: 500,
          },
        },
        meat: {
          apicbase_id: {
            type: String,
            maxlength: 500,
          },
          apicbase_url: {
            type: String,
            maxlength: 500,
          },
          title_pt: {
            type: String,
            maxlength: 500,
          },
          title_en: {
            type: String,
            maxlength: 500,
          },
        },
      },
    })
  );
