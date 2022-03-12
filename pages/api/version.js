import pjson from '../../package.json';

export default async function version(req, res) {
  return new Promise((resolve, reject) => {
    res.statusCode = 200;
    res.send({ latest: pjson.version });
    resolve();
  });
}
