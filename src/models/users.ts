import { Schema , model } from "mongoose";

var UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String
  },
  hashedPassword: {
    type: String,
  },
  facebookId: {
    type: String
  }
}, {
  timestamps: true
});

export const User = model("User", UserSchema);

