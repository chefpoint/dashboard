import database from '../../../services/database';
import User from '../../../models/User';

export default async function users(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllUsers();
      else getResult = await getUserWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    case 'PUT':
      const putResult = await putUserWith(req.query._id, JSON.parse(req.body));
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
async function getAllUsers() {
  // Fetch all documents from the database
  const allUsers = await User.find({});
  return { status: 200, data: allUsers };
}

/* * */
/* REST: GET */
async function getUserWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundUsers = await User.find({ _id: _id });

  if (foundUsers.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundUsers[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `User with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: PUT */
async function putUserWith(_id, query) {
  // Update document that matches the requested '_id'
  const updatedUser = await User.findOneAndUpdate({ _id: _id }, query, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedUser) {
    // Document was updated or created
    return { ok: true, status: 200, data: updatedUser };
  } else {
    // An Error Occurred
    return { ok: false, status: 500, data: { message: 'An Error Occurred.' } };
  }
}
