import log  from 'console';
import {generateToken }from '../utils/jwt.js';
import {sendOTP} from '../controllers/authController.js';
import User from '../models/Users.js';
import bcrypt from 'bcrypt';


export const loginUser= async (req, res )=> {
    try{
        const {phone, name, password}= req.body
        const user = await User.findOne({ $or: [ { phone }, { name } ] });

        if(!user){
            return res.status(400).json({ error: 'User not found' });
        }
         if(!password|| !user.password){
            return res.status(400).json({ error: 'Missing password data' });
         }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        await sendOTP(phone);
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "OTP sent to you phone number",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.username,
                name: user.name,
                role: user.role,
            },
        });


    }catch(error){
     console.error('Login User Error:', error);
     res.status(500).json({ error: 'Failed to login user due to ' + error.message });
    }
}


export const signUpUser= async(req,res)=>{
    try{
        const {email, name, password, phone

        }= req.body;
        let user = await User.findOne({ $or: [ { email }, { name } ] });
        
        if(user){
            return res.status(400).json({ error: 'User already exists with given email or username' });
        }
        const generatedSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, generatedSalt);
        user = new User({
            email,
            name,
            password: hashedPassword,
            phone: phone.replace(/\D/g, ''),
          
        });
        await user.save();
        const formattedPhone = user.phone.replace(/\D/g, '');

        await sendOTP(formattedPhone);
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone:user.phone
            },
        });

    }catch(error){
        res.status(500).json({ error: 'Failed to sign up user due to ' + error.message });

    }
}

export const logoutUser= async(req,res)=>{
     try{
        res.status(200).json({success:true, message:'User logged out successfully'})
     }catch(error){
         console.error('Logout User Error:', error);
         res.status(500).json({ error: 'Failed to logout user due to ' + error.message });
     }

}