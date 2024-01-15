/* * * * * */
/* MODEL: DISCOUNT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Discount"] Object */
module.exports =
  mongoose.models.Discount ||
  mongoose.model(
    'Discount',
    new mongoose.Schema({
      title: {
        type: String,
        maxlength: 100,
      },
      subtitle: {
        type: String,
        maxlength: 50,
      },
      description: {
        type: String,
        maxlength: 500,
      },
      rules: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Product.variations' }]],
      amount: {
        type: Number,
      },
      style: {
        fill: {
          type: String,
          maxlength: 30,
        },
        border: {
          type: String,
          maxlength: 30,
        },
        text: {
          type: String,
          maxlength: 30,
        },
      },
    })
  );
