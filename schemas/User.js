/* * * * * */
/* SCHEMA: USER */
/* * */

/* * */
/* IMPORTS */
import { z } from 'zod';

/* * */
/* Schema for ZOD ["CheckingAccount"] Object */
export default z.object({
  name: z
    .string({ message: 'Name must be a string' })
    .min(2, { message: 'Name must be 2 or more characters long' })
    .max(30, { message: 'Name must be no longer than 30 characters' }),
  role: z
    .string({ message: 'Role must be a string' })
    .min(2, { message: 'Role must be 2 or more characters long' })
    .max(30, { message: 'Role must be no longer than 30 characters' }),
  pwd: z.preprocess(
    (value) => String(value),
    z
      .string()
      .length(4, { message: 'Password must be exactly 4 characters long' })
      .regex(/^[0-9]*$/, { message: 'Password must be only numbers' })
      .transform((value) => Number(value))
  ),
});
