/* * * * * */
/* MODEL: PRODUCT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Product"] Object */
export default mongoose.models.Product ||
  mongoose.model(
    'Product',
    new mongoose.Schema({
      title: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Untitled Product',
      },
      short_title: {
        type: String,
        maxlength: 15,
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
        // Subdocument of Product
        // Read more: https://mongoosejs.com/docs/subdocs.html
        new mongoose.Schema({
          title: {
            type: String,
            minlength: 2,
            maxlength: 50,
          },
          price: {
            type: Number,
            default: 0,
          },
          tax_id: {
            type: String,
            minlength: 3,
            maxlength: 3,
            default: 'NOR', // NOR, INT, RED
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
