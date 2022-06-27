/* * * * * */
/* MODEL: PRODUCT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Product"] Object */
module.exports =
  mongoose.models.Product ||
  mongoose.model(
    'Product',
    new mongoose.Schema({
      title: {
        type: String,
        maxlength: 30,
        required: true,
      },
      short_title: {
        type: String,
        maxlength: 30,
      },
      image: {
        type: String,
        maxlength: 50,
      },
      description: {
        type: String,
        maxlength: 250,
      },
      variations: [
        // Subdocument of Product: https://mongoosejs.com/docs/subdocs.html
        new mongoose.Schema({
          title: {
            type: String,
            maxlength: 50,
            default: 'Normal',
          },
          price: {
            type: Number,
          },
          vat: {
            type: Number,
          },
          apicbase: {
            recipe_id: {
              type: String,
              maxlength: 100,
            },
          },
        }),
      ],
    })
  );
