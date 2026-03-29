import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//REGISTER 
export const register = async(req, res) => {
    try {
        const { name, email, password } = req.body

        //check if user exists
        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        //hashpassword
        const hashedPassword = await bcrypt.hash(password, 10)

        // create user
        const user = new User(
            {
                name,
                email,
                password:hashedPassword
            }
        )
        //save user
        await user.save()

        //send response
        res.status(201).json({ message: "User Registered", user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//LOGIN
export const login = async(req, res) => {
    try {
        const { email, password } = req.body

        //check user exists or not
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        //check if credentials match or not
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials"})
        }
        //generate jwt
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )
        // send response
        res.json({
            message: "Login Successful",
            token
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}