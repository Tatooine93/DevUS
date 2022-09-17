const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo :{
      type: String,
      required: true,
      minlemgth: 3,
      maxlength: 55,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },

    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },

    description: {
      type: String,
      max: 1024,
    },

    age: {
      type: Number
    },

    tags: {
      type: [String] // Stock les tags du User
    },

    matchs: {
      type: [String] // Stock l'ID des users avec qui il y a un match
    },

    likes: {
      type: [String] // likes received by the USER /// Stock l'ID des Users par qui le User a ete liker ( si A like B, l Id de A sera stocker chez B, comme ca si B venait a liker A le check et le match pourra se faire)
    },

/*     liked: {
      type: [String] // likes given by the USER ///
    }, */

    liked: [
      {
        type: new mongoose.Schema(
          {
            likedUserId: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now()
            }
          },
          { timestamps: false, _id: false }
        )
      }
    ],

    location: {  //{ $set:{ 'location.lat': req.body.latitude }}, to add new location inside lat and lon
      lat: {
        type: Number,
        //
        require: true
      },
      lon: {
        type: Number,
        //require: true
      }
    }
  },

  {
    timestamps: true,
  }
);

// execute function before save into DB

userSchema.pre("save", async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({email});

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if(auth){
      return user;
    }
    else {
      throw Error('Inccorect password');
    }
  }
  else {
    throw Error('Incorrect email');
  }
};

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;