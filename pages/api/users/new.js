import database from '../../../services/database';
import Customer from '../../../models/Customer';

export default async function customers(req, res) {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to save a new document with req.body
  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 3. Check for uniqueness
  try {
    // The only value that needs to, and can be, unique is 'reference'.
    // Reasons: For 'contact_email', there can be two customers with different name but same email,
    // like a company that has several employees and needs to receive the invoices
    // in the same accounting email. For NIF, the same happens: there can be two people
    // that want to share the same NIF, but receive invoices in different emails.
    // This might be expanded in the future, if emails are necessary for account creation.
    if (req.body.reference) {
      const existsReference = await Customer.exists({ reference: req.body.reference });
      if (existsReference) throw new Error('Já existe um cliente com a mesma referência');
    }
  } catch (err) {
    console.log(err);
    await res.status(409).json({ message: err.message });
    return;
  }

  // 4. Try to save a new document with req.body
  try {
    const newCustomer = await Customer(req.body).save();
    await res.status(201).json(newCustomer);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Customer creation error.' });
    return;
  }
}
