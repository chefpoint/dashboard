import _ from 'lodash';
import database from '../../../services/database';
import Transaction from '../../../models/Transaction';

export default async function transactions(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllTransactions();
      else getResult = await getTransactionWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'POST':
      const postResult = await postTransactionWith(req.body);
      res.status(postResult.status).json(postResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putTransactionWith(req.query._id, req.body);
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
async function getAllTransactions() {
  // Fetch all documents from the database and sort them
  const allTransactions = await Transaction.find({});
  return { status: 200, data: allTransactions };
}

/* * */
/* REST: GET */
async function getTransactionWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundTransactions = await Transaction.find({ _id: _id });

  if (foundTransactions.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundTransactions[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Transaction with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: POST */
async function postTransactionWith(query) {
  // Create new document
  const newTransaction = Transaction(query);
  const result = await newTransaction.save();

  if (result) {
    // Document was updated or created

    // 1. Update stock in Apicbase
    // 2. Create invoice in Vendus

    // Send response to the client
    return { status: 200, data: result };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}

/* * */
/* REST: PUT */
async function putTransactionWith(_id, body) {
  // Update document that matches the requested '_id'
  const updatedTransaction = await Transaction.findOneAndUpdate({ _id: _id }, body, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedTransaction.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedTransaction };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
