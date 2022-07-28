const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    signin : async(req, res, next) => {
        try {
            const {email, password} = req.body;
            const checkUser = await User.findOne({where: {email: email} });

            if(checkUser){
                const checkPassword = bcrypt.compareSync(password, checkUser.password);

                if(checkPassword){
                    const token = jwt.sign(
                        {
                            user :{
                                id: checkUser.id,
                                name: checkUser.name,
                                email: checkUser.email,
                            },
                        },
                        'secret'
                    )
                    res.status(200).json({message: 'sucess sign in', data: token});
                } else{
                    res.status(404).json({message: 'invalid password'});
                }
            } else{
                res.status(403).json({message: 'invalid email'});
            }
        } catch (err) {
            next(err);
        }
    },

    signup : async(req, res, next) => {
        try {
            const {name, email, password, confirmPassword} = req.body;

            if(password !== confirmPassword){
                res.status(403).json({message: 'password and confirm password does not match'});
            }

            const checkEmail = await User.findOne({where: {email:email}});
            if(checkEmail){
                return res.status(403).json({message: 'email registered'});
            }

            const user = await User.create({
                name,email,
                password: bcrypt.hashSync(password, 10), 
                role:'admin'
            });

            delete user.dataValues.password;
            console.log(user);

            res.status(201).json({
                message: 'success sign up',
                data : user
            });
        } catch (err) {
            next(err);
        }
    }
}