import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
const PORT = process.env.PORT || 9000;
const app = express()
app.use(express.json());
// app.use(express.urlencoded())
app.use(cors())
dotenv.config()
//create new db
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL)
console.log(process.env.PORT)

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}, () => {
    console.log("DB CONNECTED")
})

//create Schema 

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

//model

const User = new mongoose.model("User", userSchema);







//ROUTES
//get or post as of now we need post only
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password == user.password) {
                res.send({ message: "Login successfull!!", user: user })
            } else {
                res.send({ message: "password did't matched" })
            }

        } else {
            res.send({ message: "user not found" });
        }
    })
})






app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    //check if user already exits or not

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "user already exist!!" })
        } else {
            //if user not exist create new user
            const user = new User({
                name,
                email,
                password
            })

            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully registered!!,Please Login Now" })
                }
            })

        }
    })



})

app.listen(PORT, () => {
    console.log("port started at port ", PORT);
})