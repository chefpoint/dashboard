import { requireAuth } from '@clerk/nextjs/api';
import _ from 'lodash';
import database from '../../../services/database';
import Day from '../../../models/Day';

export default requireAuth(async (req, res) => {
  //

  if (!req.auth.userId) res.status(401).send('User is not authenticated.');

  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query.date == '*') getResult = await getAllDays();
      else getResult = await getDayWith(req.query.date);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'POST':
      const postResult = await postDayWith(JSON.parse(req.body));
      res.status(postResult.status).json(postResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putDayWith(req.query.date, JSON.parse(req.body));
      res.status(putResult.status).json(putResult.data);
      break;
    //
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

/* * */
/* REST: GET */
async function getAllDays() {
  // Fetch all documents from the database and sort them
  const allDays = await Day.find({});
  const sortedDays = allDays.sort((a, b) => new Date(a.date) - new Date(b.date));
  return { status: 200, data: sortedDays };
}

/* * */
/* REST: GET */
async function getDayWith(date) {
  // Fetch documents from the database that match the requested 'date'
  const foundDay = await Day.find({ date: date });

  if (foundDay.length > 0) {
    // If document with date exists
    return { status: 200, data: foundDay[0] };
  } else {
    // If document with date does not exist
    return { status: 404, data: { message: `Day with date: ${date} not found.` } };
  }
}

/* * */
/* REST: POST */
async function postDayWith(data) {
  // Create new document
  const newDay = new Day(data);
  const result = await newDay.save();

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
async function putDayWith(date, query) {
  // Update document that matches the requested 'date'
  const updatedDay = await Day.findOneAndUpdate({ date: date }, query, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
    runValidators: true,
  });

  if (updatedDay.date) {
    // Document was updated or created
    return { status: 200, data: updatedDay };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
