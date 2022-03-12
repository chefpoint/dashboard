import _ from 'lodash';
import database from '../../../services/database';
import Device from '../../../models/Device';

export default async function devices(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllDevices();
      else getResult = await getDeviceWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'POST':
      const postResult = await postDeviceWith(req.body);
      res.status(postResult.status).json(postResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putDeviceWith(req.query._id, req.body);
      res.status(putResult.status).json(putResult.data);
      break;
    //
    case 'DELETE':
      const deleteResult = await deleteDeviceWith(req.query._id);
      res.status(deleteResult.status).json(deleteResult.data);
      break;
    //
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

/* * */
/* REST: GET */
async function getAllDevices() {
  // Fetch all documents from the database and sort them
  const allDevices = await Device.find({}).populate(['location', 'layout']);
  return { status: 200, data: allDevices };
}

/* * */
/* REST: GET */
async function getDeviceWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundDevices = await Device.find({ _id: _id });

  if (foundDevices.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundDevices[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Device with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: POST */
async function postDeviceWith(query) {
  // Create new document
  const newDevice = Device(query);
  const result = await newDevice.save();

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
async function putDeviceWith(_id, body) {
  // Update document that matches the requested '_id'
  const updatedDevice = await Device.findOneAndUpdate({ _id: _id }, body, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedDevice.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedDevice };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}

/* * */
/* REST: DELETE */
async function deleteDeviceWith(_id) {
  // Delete document that matches the requested '_id'
  const deletedDevice = await Device.findOneAndDelete({ _id: _id });

  if (deletedDevice) {
    // Document was deleted or created
    return { status: 200, data: deletedDevice };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
