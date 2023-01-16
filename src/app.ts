import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { User } from './models/users.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
const app = express();
const port = 5003;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/facebook');
var db = mongoose.connection;
app.use(express.json());
app.use(cors())

db.once("open", function () {
  console.log('connected');
});

app.post('/user/facebook', async (req, res) => {
    try {
        const {  userId = '', accessToken = '' } = req.body;
        if(userId == '' || accessToken == ''){
          return  res.status(400).json({ message: "userId and accessToken are required"}); 
        }
        //get user by facebook userId and accesToken
        let { data }: any = await getUserByFacebookIdAndAccessToken(accessToken, userId);
        //check if user exist
        var user = await User.findOne({ facebookId: data.id});
        var authObject: any = {}
        if(user){ 
          var token = jwt.sign({ id: user._id}, 'secret', { expiresIn: '20h' });
          authObject = { auth: true, token, user, message: "Successfully logged in." };
          return res.status(201).json(authObject);
        }
        else{
          user = await User.create({
            name: data.name,
            email: data.email,
            facebookId: data.id
          }) 
          var token = jwt.sign({ id: user._id}, 'secret', { expiresIn: '20h' });
          authObject = { auth: true, token, user, message: "Successfully Registered." };
          return res.status(201).json(authObject);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message}); 
    }
});

let getUserByFacebookIdAndAccessToken = ( accessToken: string, userId: string) => {
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}?fields=id,name,email&access_token=${accessToken}`;
    let result = axios.get(urlGraphFacebook);
    return result;
}

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
