import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Transaction';

/* * */
/* GET TRANSACTION INVOICE */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 2. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 3. Try to fetch the correct transaction from the database
  let transaction;
  try {
    transaction = await Model.findOne({ _id: req.query._id });
    if (!transaction)
      return await res.status(404).json({ message: `Transaction with _id: ${req.query._id} not found.` });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this transaction.' });
  }

  // 4. Fetch Vendus API to get invoice PDF
  try {
    // 4.1. Get the PDF from Vendus API
    const response = await fetch(`https://www.vendus.pt/ws/v1.2/documents/${transaction.invoice.invoice_id}.pdf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(process.env.VENDUS_API_KEY).toString('base64'),
      },
    });
    // 4.2. Set response header declaring the content as a PDF document
    await res.setHeader('Content-Type', 'application/pdf');
    // 4.3. Show the document in the browser (inline, not attachment) and the correct filename
    await res.setHeader('Content-Disposition', `inline; filename="${transaction.invoice.number}.pdf"`);
    // 4.4. Send the document to the client
    return await res.status(200).json(response.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message });
  }
});
