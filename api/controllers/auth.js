import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })

        await newUser.save();
        res.status(200).send("User has been created");

    } catch (err) {
        next(err)
    }
}
//Login
export const login = async (req, res, next) => {
    try {
       const user = await User.findOne({username:req.body.username})
       if(!user) return next(createError(404, "user not found")) //verify username

       const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
       
        if(!isPasswordCorrect) return next(createError(400, "wornd password or username")) //verify password

        const {password,isAdmin, ...otherDetails} =user._doc; //to remove hash passw & admin;
        res.status(200).json({...otherDetails});
    } catch (err) {
        next(err)
    }
}