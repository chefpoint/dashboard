/* * * * * */
/* SCHEMA: CHECKING ACCOUNT */
/* * */

/* * */
/* IMPORTS */
import { z } from 'zod';

/* * */
/* Schema for ZOD ["CheckingAccount"] Object */
export default z.object({
  title: z
    .string({ message: 'Title must be a string' })
    .min(2, { message: 'Title must be 2 or more characters long' })
    .max(30, { message: 'Title must be no longer than 30 characters' })
    .default('Untitled Checking Account'),
  client_name: z
    .string({ message: 'Client Name must be a string' })
    .min(2, { message: 'Client Name must be 2 or more characters long' })
    .max(30, { message: 'Client Name must be no longer than 30 characters' }),
  tax_region: z
    .string({ message: 'Tax Region must be a string' })
    .length(2, { message: 'Tax Region must be exactly 2 characters long' })
    .regex(/^[A-Z]+$/i, { message: 'Tax Region must be only letters' })
    .transform((value) => value.toUpperCase()),
  tax_number: z
    .string({ message: 'Tax Number must be a string' })
    .length(9, { message: 'Tax Number must be exactly 9 characters long' })
    .regex(/^[0-9]*$/, { message: 'Tax Number must be only numbers' }),
});
