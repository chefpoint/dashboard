/* * * * * */
/* MODEL: LAYOUT */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Layout"] Object */
module.exports =
  mongoose.models.Layout ||
  mongoose.model(
    'Layout',
    new mongoose.Schema({
      title: {
        type: String,
        maxlength: 30,
        default: 'Untitled',
      },
      folders: [
        // Subdocument of Layout: https://mongoosejs.com/docs/subdocs.html
        new mongoose.Schema({
          title: {
            type: String,
            maxlength: 30,
            default: 'Untitled',
          },
          position: {
            type: Number,
          },
          slots: [
            {
              position: { type: Number },
              product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            },
          ],
        }),
      ],
    })
  );
