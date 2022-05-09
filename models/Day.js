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
      vegan: {
        apicbase_id: {
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
        title_pt: {
          type: String,
          maxlength: 500,
        },
        title_en: {
          type: String,
          maxlength: 500,
        },
      },
    })
  );

// {
//   "date": "2022-05-02",
//   "special_day": false,
//   "vegan": {
//     "pt": "Tortilla Espanhola de Batata e Pimento",
//     "en": "Spanish Potato and Pepper Tortilla"
//   },
//   "fish": {
//     "pt": "Tiras de Pota Frita c/ Arroz de Coentros e Maionese de Limão",
//     "en": "Fried Cuttlefish Strips w/ Coriander Rice and Lemon Mayonnaise"
//   },
//   "meat": {
//     "pt": "Costeleta de Porco c/ Batata Frita e Coleslaw",
//     "en": "Pork Chop w/ French Fries and Coleslaw"
//   }
// }
