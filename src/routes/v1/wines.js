const express = require('express');
const mysql = require('mysql2/promise');
const checkIfLoggedIn = require('../../middleware/authorization');
const { mySQLConfig } = require('../../config');

const router = express.Router();

router.get('/wines', checkIfLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const [data] = await con.execute(`SELECT * FROM wines`);

    await con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Something wrong with the server. Please try again later' });
  }
});

router.post('/wines', checkIfLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const [data] = await con.execute(`
      INSERT INTO wines (name, region, year)
      VALUES (
          ${mysql.escape(req.body.name)},
          ${mysql.escape(req.body.region)},
          ${mysql.escape(req.body.year)}
      )`);

    await con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Something wrong with the server. Please try again later' });
  }
});

module.exports = router;
