const express = require('express');
const Joi = require('joi');
const mysql = require('mysql2/promise');
const { mySQLConfig } = require('../../config');

const isLoggedIn = require('../../middleware/authorization');
const validation = require('../../middleware/validation');

const router = express.Router();

const collectionsSchema = Joi.object({
  wine_id: Joi.string().required(),
  quantity: Joi.number().required(),
});

router.get('/my-wines', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const [data] = await con.execute(`SELECT * FROM collections WHERE user_id = ${req.user.accountId}`);

    await con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Something wrong with the server. Please try again later' });
  }
});

router.post('/my-wines', isLoggedIn, validation(collectionsSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const [data] = await con.execute(`INSERT INTO collections
     (wine_id, user_id, quantity) VALUES (
    ${mysql.escape(req.body.wine_id)}, 
    ${mysql.escape(req.body.accountId)}, 
    ${mysql.escape(req.body.quantity)})`);

    await con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Something wrong with the server. Please try again later' });
  }
});

module.exports = router;
