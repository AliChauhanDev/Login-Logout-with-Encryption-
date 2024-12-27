const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const Data = require('./models/data');


mongoose.connect('mongodb://127.0.0.1:27017/UserData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.render('index', { error: null });
});


app.get('/form', (req, res) => {
  res.render('form', { error: null });
});

 
app.post('/submit', async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.render('form', { error: 'Both fields are required!' });
  }
  try {
    const existingUser = await Data.findOne({ name: username });
    if (existingUser) {
      return res.render('index', { error: 'Username already exists! Please choose another one.' });
    }
    const newUser = new Data({
      name: username,
      pass: password,
    });
    await newUser.save();
    res.render('success', { username });
  } catch (err) {
    console.error('Error saving user:', err);
    res.render('form', { error: 'An error occurred while saving your data. Please try again.' });
  }
});



app.get('/signin', (req, res) => {
  res.render('form', { error: null }); 
});


app.post('/signin', async (req, res) => {
  
  const { username: user, password: pas } = req.body;
  if (!user || !pas) {
    return res.render('form', { error: 'Both fields are required!' });
  }
  try {
    
    const existingUser = await Data.findOne({ name: user });
    if (!existingUser) {
      return res.render('form', { error: 'Invalid username!' });
    }

    const isMatch = await bcrypt.compare(pas, existingUser.pass);
    console.log("actual password",existingUser.pass);
    console.log("sign in time passwoed :- ",pas);
    console.log(isMatch);
    if (!isMatch) {
      return res.render('form', { error: 'Invalid password!' });
    }
    res.render('success', { username: user }); 
  } catch (err) {
    console.error('Error during login:', err);
    res.render('form', { error: 'An error occurred. Please try again.' });
  }
});



app.get('/success', (req, res) => {
  res.render('success'); 
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
