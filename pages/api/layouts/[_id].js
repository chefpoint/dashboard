import _ from 'lodash';
import database from '../../../services/database';
import Layout from '../../../models/Layout';
import Product from '../../../models/Product';

export default async function layouts(req, res) {
  //
  // Connect to the Database
  database.connect();

  // const newLayout = new Layout({
  //   title: 'default',
  //   folders: [{ title: 'Bebidas', position: 1, slots: [{}] }],
  // });

  // await newLayout.save();
  // return;

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllLayouts();
      else getResult = await getLayoutWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putLayoutWith(req.query._id, req.query);
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
async function getAllLayouts() {
  // Fetch all documents from the database and sort them
  const allLayouts = await Layout.find({}).populate('folders.slots.product');
  return { status: 200, data: allLayouts }; //_.sortBy(allLayouts, 'position')
}

/* * */
/* REST: GET */
async function getLayoutWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundLayout = await Layout.find({ _id: _id }).populate('folders.slots.product');

  if (foundLayout.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundLayout[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Layout with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: PUT */
async function putLayoutWith(_id, query) {
  // Update document that matches the requested '_id'
  const updatedLayout = await Layout.findOneAndUpdate({ _id: _id }, query, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedLayout.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedLayout };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
