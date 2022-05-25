require('dotenv').config();

module.exports = {
  mySQLConfig: {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    database: process.env.SQL_DB,
  },
  serverPort: process.env.SERVER_PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
};
