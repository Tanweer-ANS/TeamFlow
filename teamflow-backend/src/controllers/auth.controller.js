import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";

//REGISTER 
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        //check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        //hashpassword
        const hashedPassword = await bcrypt.hash(password, 10)

        // create user
        const user = new User(
            {
                name,
                email,
                password: hashedPassword
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
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        //check user exists or not
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        //check if credentials match or not
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        //generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // store refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//REFRESH TOKEN
export const refresh = async(req, res) => {
    try {
        const { refreshToken } = req.body

        if(!refreshToken){
            return res.status(401).json({ message: "No Refreshh token" })
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )

        const user = await User.findById(decoded.userId)
        if(!user || user.refreshToken !== refreshToken){
            return res.status(403).json({ message: "Invalid Refresh Token" })
        }

        const newAccessToken = generateAccessToken(user)
        res.json({ accessToken: newAccessToken })
    } catch (error) {
        res.status(403).json({ message: "Token expired"})
    }
}

export const logout = async(req, res) => {
    try {
        const user = await User.findById(req.user.userId)

        user.refreshToken = null

        await user.save()

        res.json({ message: "Logged Out Successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}