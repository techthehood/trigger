const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Create a schema
// const userSchema = new Schema({
//   email: String,
//   password: String
// });

// version 2 for local strategy
// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// });

// version 3 for oauth and local
const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local','google','facebook'],
    required:true
  },
  local:{
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    image_id: { type: Schema.Types.ObjectId },
    email_id: { type: Schema.Types.ObjectId }
  },
  google: {
    id:{
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    image: {
      type: String,
    },
    image_id: { type: Schema.Types.ObjectId },
    email_id: { type: Schema.Types.ObjectId }
  },
  facebook: {
    id:{
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    image: {
      type: String,
    },
    image_id: { type: Schema.Types.ObjectId },
    email_id: { type: Schema.Types.ObjectId }
  }
});

userSchema.pre('save', async function (next) {
  // needs to use this so no arrow fn here
  try {

    // oauth mod
    if(this.method !== 'local'){
      next();
    }//if

    // generate a salt
    const salt = await bcrypt.genSalt(10);

    // Generate a password hash (salt + hash)
    // bcrypt.hash('user password over here', salt);
    const passwordHash = await bcrypt.hash(this.local.password, salt);

    console.log('salt', salt);
    console.log('normal password', this.local.password);
    console.log('hashed password', passwordHash);
    this.local.password = passwordHash;

  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    console.log("this.local.password",this.local.password);
    console.log("newPassword",newPassword);

    return await bcrypt.compare(newPassword, this.local.password)
  } catch (error) {
    // no access to next() here
    throw new Error(error);
  } finally {

  }
}

// Create a model
const User = mongoose.model('user',userSchema);

// Export the model
module.exports = User;
