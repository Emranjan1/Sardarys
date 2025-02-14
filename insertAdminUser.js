const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
};


const adminEmail = 'Mohammed_sardary@hotmail.com';
const adminPassword = 'Sardarylawda123';

const checkAndInsertAdminUser = async () => {
  let connection;

  try {

    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the MySQL database.');


    const [rows] = await connection.execute('SELECT * FROM Users WHERE email = ?', [adminEmail]);

    if (rows.length > 0) {
      console.log('Admin user already exists:', rows[0]);
      return;
    }

    console.log('Admin user not found, creating a new one.');


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const sql = `
      INSERT INTO Users (firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country, password, isAdmin, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const values = [
      'Admin', 'User', adminEmail, '1234567890', '123 Main St', '', '12345', 'London', 'United Kingdom', hashedPassword, 1,
    ];

    const [result] = await connection.execute(sql, values);
    console.log(`Admin user created with ID: ${result.insertId}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {

      await connection.end();
      console.log('Closed the database connection.');
    }
  }
};

checkAndInsertAdminUser();
