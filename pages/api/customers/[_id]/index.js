import database from '../../../../services/database';
import Customer from '../../../../models/Customer';

export default async function customers(req, res) {
  switch (req.method) {
    case 'GET':
      return await getCustomer(req, res);
    case 'PUT':
      return await putCustomer(req, res);
    case 'DELETE':
      return await deleteCustomer(req, res);
    default:
      await res.setHeader('Allow', ['GET', 'PUT']);
      await res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }
}

/* * */
/* REST: GET */
async function getCustomer(req, res) {
  //
  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the correct Customer from the database
  try {
    const customer = await Customer.findOne({ _id: req.query._id });
    if (!customer) return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    await res.status(200).send(customer);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this customer.' });
    return;
  }
}

/* * */
/* REST: PUT */
async function putCustomer(req, res) {
  //
  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to update the correct customer
  try {
    const updatedCustomer = await Customer.findOneAndUpdate({ _id: req.query._id }, JSON.parse(req.body), { new: true }); // Return the updated document
    if (!updatedCustomer) return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    return await res.status(200).send(updatedCustomer);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this customer.' });
    return;
  }
}

/* * */
/* REST: DELETE */
async function deleteCustomer(req, res) {
  //
  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to update the correct customer
  try {
    const deletedCustomer = await Customer.findOneAndDelete({ _id: req.query._id }); // Return the deleted document
    if (!deletedCustomer) return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedCustomer);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot delete this customer.' });
    return;
  }
}
