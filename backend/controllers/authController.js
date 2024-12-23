import { oauth2Client } from '../config/googleConfig.js';
import axios from 'axios';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';





const googleLogin = async (req, res) => {
    try {
        const code = req.query.code;

        if (!code) {
            return res.status(400).json({
                message: "Missing code"
            });
        }
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);


        const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        console.log("userInfo:", userInfo.data);

        const { email, name, picture } = userInfo.data;
        let user = await User.findOne({ email });


        if (!user) {
            user = await User.create({
                name,
                email,
                profilePic: picture,
            });
        }
        const { _id } = user;

        const token = jwt.sign(
            { _id, email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user
        });

    } catch (err) {
        console.error(`Error while requesting google code : ${err}`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export { googleLogin }