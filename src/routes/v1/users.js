const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userValidation = require('../../middleware/validation');
const { mySQLConfig, jwtToken } = require('../../config');
const { loginSchema, registerSchema, changePassword } = require('../../middleware/validation/loginVerification');

const router = express.Router();

router.post('/login', userValidation(loginSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const [data] = await con.execute(`SELECT * FROM users WHERE email=${mysql.escape(req.body.email)} LIMIT 1`);
    await con.end();

    if (data.length !== 1) {
      return res.status(400).send({ msg: 'Incorrect email or password' });
    }

    const checkHash = bcrypt.compareSync(req.body.password, data[0].password);

    if (!checkHash) {
      return res.status(400).send({ msg: 'Incorrect email or password' });
    }

    const token = jsonwebtoken.sign({ id: data[0].id }, jwtToken);
    return res.send({ msg: 'login successful', token });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'Something wrong with the server. Please try again later' });
  }
});

router.post('/register', userValidation(registerSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const hash = bcrypt.hashSync(req.body.password, 10);
    const data = await con.execute(`INSERT INTO users (username, password, email)
    VALUES (${mysql.escape(req.body.username)}, ${mysql.escape(hash)},${mysql.escape(req.body.email)})`);
    await con.end();

    if (!data.insertId) {
      return res.status(500).send({
        msg: 'Something wrong with the server. Please try again later',
      });
    }

    return res.send({ msg: 'Registration completed', data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'Something wrong with the server. Please try again later' });
  }
});

router.post('/change-password', userValidation(changePassword), async (req, res) => {
  try {
    const con = await mysql.createConnection(mySQLConfig);
    const [data] = await con.execute(`SELECT * FROM users WHERE email=${mysql.escape(req.body.email)} LIMIT 1`);
    const chechHash = bcrypt.compareSync(req.body.oldPassword, data[0].password);

    if (!chechHash) {
      await con.end();
      return res.status(400).send({ err: 'Incorrect old password' });
    }

    const newPasswordHash = bcrypt.hashSync(req.body.newPassword, 10);

    con.execute(
      `UPDATE users SET password=${mysql.escape(newPasswordHash)} WHERE email=${mysql.escape(req.body.email)}`,
    );

    await con.end();
    return res.send({ msg: 'Password changed' });
  } catch (err) {
    console.log(`${err} change`);
    return res.status(500).send({
      msg: 'Something wrong with the server. Please try again later',
    });
  }
});

module.exports = router;
