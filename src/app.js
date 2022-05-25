const express = require('express');
const cors = require('cors');
const usersRoute = require('./routes/v1/users');
const winesRoute = require('./routes/v1/wines');
const collectionsRoute = require('./routes/v1/collections');
const { serverPort } = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

app.use(`/v1/users/`, usersRoute);
app.use(`/v1/wines/`, winesRoute);
app.use(`/v1/collections/`, collectionsRoute);

app.get('/', (req, res) => {
  res.send({ msg: 'Server is up and running' });
});

app.all('*', (req, res) => {
  res.status(404).send({ err: 'Error, page not found' });
});

app.listen(serverPort, () => {
  console.log(`Server is up and running on port ${serverPort}`);
});
