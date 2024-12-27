const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Data = require('./models/data'); // Assuming you have a 'Data' model for your users

mongoose.connect('mongodb://127.0.0.1:27017/UserData');

async function getPasswordForUser(username) {
  try {
    // Step 1: Find the user by their username
    const user = await Data.findOne({ name: username });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Step 2: Extract the hashed password and store it in the variable p
    const p = user.pass; // This is the hashed password

    let match = await bcrypt.compare('a', p);
    console.log(match);
    
    // console.log('Hashed password of user:',user,":-", p);

    return p; // You can use this variable `p` to compare with a plain text password later
  } catch (err) {
    console.error('Error fetching user:', err);
  }
}

// Call the function with username 'aaa'
getPasswordForUser('a');

