import pjson from '../../package.json';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* GET LATEST APP VERSION */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  return new Promise((resolve, reject) => {
    res.statusCode = 200;
    res.send({ latest: pjson.version });
    resolve();
  });
});
