import _ from 'lodash';
import database from '../../../services/database';
import Candidate from '../../../models/Candidate';

export default async function candidates(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllCandidates();
      else getResult = await getCandidateWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'POST':
      const postResult = await postCandidateWith(req.body);
      res.status(postResult.status).json(postResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putCandidateWith(req.query._id, req.query);
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
async function getAllCandidates() {
  // Fetch all documents from the database
  const allCandidates = await Candidate.find({});
  return { status: 200, data: allCandidates };
}

/* * */
/* REST: GET */
async function getCandidateWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundCandidates = await Candidate.find({ _id: _id });

  if (foundCandidates.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundCandidates[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Candidate with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: POST */
async function postCandidateWith(query) {
  // Create new document
  const newCandidate = Candidate(JSON.parse(query));
  const result = await newCandidate.save();

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
async function putCandidateWith(_id, query) {
  // Update document that matches the requested '_id'
  const updatedCandidate = await Candidate.findOneAndUpdate({ _id: _id }, query, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedCandidate.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedCandidate };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
