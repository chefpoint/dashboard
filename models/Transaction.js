/* * * * * */
/* MODEL: TRANSACTION */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Transaction"] Object */
module.exports =
  mongoose.models.Transaction ||
  mongoose.model(
    'Transaction',
    new mongoose.Schema({
      timestamp: {
        type: String,
        maxlength: 30,
      },

      // Device
      device: {
        device_id: {
          type: String,
          maxlength: 30,
        },
        title: {
          type: String,
          maxlength: 30,
        },
      },

      // Location
      location: {
        location_id: {
          type: String,
          maxlength: 30,
        },
        title: {
          type: String,
          maxlength: 30,
        },
        apicbase: {
          outlet_id: {
            type: String,
            maxlength: 30,
          },
        },
      },

      // Layout
      layout: {
        layout_id: {
          type: String,
          maxlength: 30,
        },
        title: {
          type: String,
          maxlength: 30,
        },
      },

      // Customer
      customer: {
        customer_id: {
          type: String,
          maxlength: 30,
        },
        first_name: {
          type: String,
          maxlength: 30,
        },
        last_name: {
          type: String,
          maxlength: 30,
        },
        email: {
          type: String,
          maxlength: 30,
        },
        reference: {
          type: String,
          maxlength: 30,
        },
        tax_country: {
          type: String,
          minlength: 2,
          maxlength: 2,
        },
        tax_number: {
          type: String,
          minlength: 9,
          maxlength: 9,
        },
      },

      // Items
      items: [
        {
          product_id: {
            type: String,
            maxlength: 30,
          },
          product_image: {
            type: String,
            maxlength: 30,
          },
          product_title: {
            type: String,
            maxlength: 30,
          },
          variation_id: {
            type: String,
            maxlength: 30,
          },
          variation_title: {
            type: String,
            maxlength: 50,
          },
          price: {
            type: Number,
          },
          tax_id: {
            type: String,
            maxlength: 3, // NOR, INT, RED
          },
          tax_percentage: {
            type: Number,
          },
          qty: {
            type: Number,
          },
          apicbase: {
            recipe_id: {
              type: String,
              maxlength: 30,
            },
          },
        },
      ],

      // Discounts
      discounts: [
        {
          discount_id: {
            type: String,
            maxlength: 30,
          },
          title: {
            type: String,
            maxlength: 30,
          },
          subtitle: {
            type: String,
            maxlength: 50,
          },
          amount: {
            type: Number,
          },
        },
      ],

      // Payment
      payment: {
        is_paid: {
          type: Boolean,
        },
        method_value: {
          type: String,
        },
        method_label: {
          type: String,
        },
        total_amount: {
          type: Number,
        },
        checking_account: {
          checking_account_id: {
            type: String,
          },
          title: {
            type: String,
          },
          client_name: {
            type: String,
          },
          tax_country: {
            type: String,
            minlength: 2,
            maxlength: 2,
          },
          tax_number: {
            type: String,
            minlength: 9,
            maxlength: 9,
          },
        },
      },

      // User
      user: {
        user_id: {
          type: String,
        },
        name: {
          type: String,
        },
      },

      // Invoice
      invoice: {
        invoice_id: {
          type: String,
        },
        type: {
          type: String,
        },
        number: {
          type: String,
        },
        date: {
          type: String,
        },
        system_time: {
          type: String,
        },
        local_time: {
          type: String,
        },
        amount_gross: {
          type: String,
        },
        amount_net: {
          type: String,
        },
        hash: {
          type: String,
        },
      },
    })
  );
