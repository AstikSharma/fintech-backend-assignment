import User from '../models/User';

export const registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;
    try{
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User exists"});
        }
        const user = await User.create({
            name,
            email,
            password, 
            role
        });
        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                toke: user.generateToken()
            });
        }
    } catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: user.generateToken()
            });
        } else {
            res.status(401).json({message: 'Invalid email or password'});
        }
    } catch(error) {
        res.status(500).json({message: 'Server error'});
    }
};