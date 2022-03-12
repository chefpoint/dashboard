import _ from 'lodash';
import database from '../../../services/database';
import Customer from '../../../models/Customer';

export default async function customers(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllCustomers();
      else getResult = await getCustomerWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putCustomerWith(req.query._id, req.query);
      res.status(putResult.status).json(putResult.data);
      break;
    //
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

/* * */
/* REST: GET */
async function getAllCustomers() {
  // Fetch all documents from the database
  const allCustomers = await Customer.find({});
  return { status: 200, data: allCustomers };
}

/* * */
/* REST: GET */
async function getCustomerWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundCustomers = await Customer.find({ _id: _id });

  if (foundCustomers.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundCustomers[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Customer with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: PUT */
async function putCustomerWith(_id, query) {
  // Update document that matches the requested '_id'
  const updatedCustomer = await Customer.findOneAndUpdate({ _id: _id }, query, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedCustomer.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedCustomer };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
