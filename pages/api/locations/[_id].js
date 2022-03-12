import _ from 'lodash';
import database from '../../../services/database';
import Location from '../../../models/Location';

export default async function locations(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllLocations();
      else getResult = await getLocationWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'POST':
      const postResult = await postLocationWith(req.body);
      res.status(postResult.status).json(postResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putLocationWith(req.query._id, req.body);
      res.status(putResult.status).json(putResult.data);
      break;
    //
    case 'DELETE':
      const deleteResult = await deleteLocationWith(req.query._id);
      res.status(deleteResult.status).json(deleteResult.data);
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
async function getAllLocations() {
  // Fetch all documents from the database and sort them
  const allLocations = await Location.find({});
  return { status: 200, data: allLocations };
}

/* * */
/* REST: GET */
async function getLocationWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundLocations = await Location.find({ _id: _id });

  if (foundLocations.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundLocations[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Location with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: POST */
async function postLocationWith(query) {
  // Create new document
  const newLocation = Location(query);
  const result = await newLocation.save();

  if (result) {
    // Document was updated or created
    return { status: 200, data: result };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}

/* * */
/* REST: PUT */
async function putLocationWith(_id, body) {
  // Update document that matches the requested '_id'
  const updatedLocation = await Location.findOneAndUpdate({ _id: _id }, body, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedLocation.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedLocation };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}

/* * */
/* REST: DELETE */
async function deleteLocationWith(_id) {
  // Delete document that matches the requested '_id'
  const deletedLocation = await Location.findOneAndDelete({ _id: _id });

  if (deletedLocation) {
    // Document was deleted or created
    return { status: 200, data: deletedLocation };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
