import database from '../../../../services/database';
import Product from '../../../../models/Product';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* EDIT PRODUCT */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Parse request body into JSON
  try {
    req.body = JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 2. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 3. Configure the Product
  let formattedProduct = {};
  try {
    // Title
    formattedProduct.title = req.body.title || 'Untitled Product';
    // Location
    formattedProduct.location = req.body.location?.value || null;
    // Layout
    formattedProduct.layout = req.body.layout?.value || null;
    // Users
    formattedProduct.users = [];
    for (const item of req.body.users) formattedProduct.users.push(item.value);
    // Discounts
    formattedProduct.discounts = [];
    for (const item of req.body.discounts) formattedProduct.discounts.push(item.value);
    // Checking Accounts
    formattedProduct.checking_accounts = [];
    for (const item of req.body.checking_accounts) formattedProduct.checking_accounts.push(item.value);
    //
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Failed to format req.body.' });
    return;
  }

  // 4. Try to update the correct Product
  try {
    const editedProduct = await Product.findOneAndUpdate({ _id: req.query._id }, formattedProduct, { new: true }); // Return the edited document
    if (!editedProduct) return await res.status(404).json({ message: `Product with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedProduct);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this Product.' });
    return;
  }
});
