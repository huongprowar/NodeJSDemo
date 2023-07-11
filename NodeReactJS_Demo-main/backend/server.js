const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

//Connect to the database
sql.connect('server=DESKTOP-LGFID7C;database=SWP391;User ID=sa;Password=12345678;TrustServerCertificate=True;Trusted_Connection=True', (err) => {
  //  sql.connect(config, (err) => {
  if (err) {
    console.log('Database connection failed!');
    console.log(err);
  } else {
    console.log('Database connected successfully!');
  }
});

// API endpoints

// Fetch all items
app.get('/api/login', (req, res) => {
  const query = 'SELECT * FROM Course';
  sql.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to fetch items' });
    } else {
      res.json(result.recordset);
    }
  });
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  const query = `select * from [User] where Username='${username}' and Password='${password}'`;
  sql.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Account not found' });
    } else if (result.recordset.length == 0) {
      res.json({ error: 'Account not found' });
    }
    else {
      res.json(result.recordset);
      console.log(`This is username${username}`);
    }
  });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  const query = `select * from [User] where Username='${username}'`;
  sql.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Account not found' });
    } else if (result.recordset.length != 0) {
      res.json({ error: 'Account already exist' });
    }
    else {
      sql.query(`insert into [User](username, password) values('${username}','${password}')`)
      res.json("Register success");      
    }
  });
});



// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
