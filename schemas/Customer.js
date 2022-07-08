/* * * * * */
/* SCHEMA: CUSTOMER */
/* * */

/* * */
/* IMPORTS */
import { z } from 'zod';

/* * */
/* Schema for ZOD ["Customer"] Object */
export default z.object({
  first_name: z
    .string({ message: 'First Name must be a string' })
    .min(2, { message: 'First Name must be 2 or more characters long' })
    .max(30, { message: 'First Name must be no longer than 30 characters' }),
  last_name: z
    .string({ message: 'Last Name must be a string' })
    .max(30, { message: 'Last Name must be no longer than 30 characters' }),
  tax_region: z.optional(
    z
      .string({ message: 'Tax Region must be a string' })
      .max(2, { message: 'Tax Region must be exactly 2 characters long' })
      .regex(/^[a-zA-Z]*$/, { message: 'Tax Region must be only letters' })
      .transform((value) => value.toUpperCase())
  ),
  tax_number: z.preprocess(
    (value) => String(value),
    z
      .string()
      .max(9, { message: 'Tax Number must be exactly 9 characters long' })
      .transform((value) => (value.length ? Number(value) : undefined))
  ),
  contact_email: z.optional(
    z
      .string({ message: 'Contact Email must be a string' })
      .max(50, { message: 'Contact Email must be no longer than 50 characters' })
  ),
  send_invoices: z.boolean().default(false),
  reference: z.optional(
    z
      .string({ message: 'Reference must be a string' })
      .max(30, { message: 'Reference must be no longer than 30 characters' })
  ),
  birthday: z.string(),
});
