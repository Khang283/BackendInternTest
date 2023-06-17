const { User, Address,Request,Store,Employee } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const {SECRET_KEY} = require('../constant');
const store = require('../models/store');
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'misael.turner@ethereal.email',
        pass: 'buaZzswrbtcquh9DPu'
    }
});

class UserController {
    async createUser(req, res) {
        const user = req.body;
        try {
            const count = await User.count({
                where: {
                    [Op.or]: [
                        { email: user.email },
                        { phone: user.phone }
                    ]
                }
            })
            if (count > 0) {
                return res.status(400).json({ message: "Tài khoản đã tồn tại" });
            }
            else {
                let address = await Address.findOne({
                    where: {
                        houseNumber: user.address.houseNumber,
                    }
                })
                if (address === null) {
                    address = await Address.create(user.address);
                }
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(user.password, salt);
                const newUser = await User.create({
                    fullName: user.fullName,
                    phone: user.phone,
                    email: user.email,
                    password: hash,
                    dob: user.dob || null,
                    gender: user.gender,
                    userType: user.userType || "Freelancer", //Owner hoặc Freelancer
                    avatar: user.avatar || null,
                    addressId: address.id,
                })
                jwt.sign({
                    userId: newUser.id
                }, SECRET_KEY,
                    {
                        expiresIn: '1d'
                    }, async (err, token) => {
                        const url = `http://localhost:5000/api/v1/users/confirm/${token}`;

                        let info = await transporter.sendMail({
                            from: 'khangfun@gmail.com',
                            to: `${newUser.email}`,
                            subject: "Confirm Email",
                            text: `Xin chào ${newUser.fullName}`,
                            html: `<a href="${url}">Nhấn vào link để xác thực: ${url}</a>`,
                        });
                    })
                return res.status(200).json(newUser);
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ Error: e });
        }
    }

    async getAllUser(req, res) {
        try {
            const users = await User.findAll({ include: [Address] })
            return res.status(200).json(users);
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    }

    async confirmAccount(req, res) {
        const token = req.params.token;
        try {
            let decoded = jwt.verify(token, SECRET_KEY);
            let userId = decoded.userId;
            const user = await User.findOne({
                where: {
                    id: userId,
                }
            });
            if (user === null) {
                return res.status(404).json({ message: "Tài khoản không chính xác", });
            }
            else {
                var updateUser = await User.update({ accountConfirmed: true }, {
                    where: {
                        id: user.id,
                    }
                })
                return res.status(200).json(updateUser);
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    }

    async login(req, res) {
        try {
            const email = req.body.email || null;
            const phone = req.body.phone || null;
            const password = req.body.password;
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        {email: email},
                        {phone: phone}
                    ],
                }
            });
            if (user === null) {
                return res.status(404).json({ message: "Tài khoản không chính xác!" });
            }
            if (!user.accountConfirmed) return res.status(400).json({ message: "Bạn chưa xác thực email" });
            bcrypt.compare(password, user.password)
                .then(response => {
                    if (response) {
                        jwt.sign({
                            userId: user.id,
                        }, SECRET_KEY, {
                            expiresIn: '1d',
                        }, (err, token) => {
                            return res.status(200).json({
                                message: "Đăng nhập thành công",
                                token: token,
                            });
                        })
                    }
                })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Đã xảy ra lỗi" });
        }
    }

    async getFreelancerByPhone(req,res){
        const phone = req.query.phone;
        const user = await User.findOne({
            where: {
                [Op.and]:[
                    {phone: phone,},
                    {userType: "Freelancer"}
                ]
            }
        })
        if(user === null) return res.status(404).json({message: "Không tìm thấy người làm tự do"});
        return res.status(200).json(user);
    }

    async createRequestByFreelancer(req,res){
        const bearerToken = req.get('Authorization');
        const token = bearerToken.substring(7);
        const storeId = req.body.storeId;
        try{
            let decoded=jwt.verify(token,SECRET_KEY);
            let freelancerId = decoded.userId;
            const freelancer = await User.findOne({
                where: {
                    [Op.and]:[
                        {id: freelancerId},
                        {userType: "Freelancer"}
                    ]
                }
            })
            if(freelancer === null ) return res.status(404).json({message: "Không tìm thấy tài khoản, hãy chắc rằng bạn đã tạo tài khoản hoặc đăng nhập bằng tài khoản Freelancer"});
            const employee = await Employee.findOne({
                where: {
                    userId: freelancerId,
                }
            })
            console.log(employee);
            if(employee) return res.status(400).json({message: "Bạn chỉ có thể làm cho 1 cửa hàng duy nhất trong 1 thời điểm"});
            const request = await Request.create({userId: freelancerId,storeId: storeId});
            return res.status(200).json({message: "Yêu cầu làm việc của bạn đã được gửi"});
        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }

    }

    async getAllStoreFromOwner(req,res){
        const bearerToken = req.get('Authorization');
        const token = bearerToken.substring(7);
        try{
            let decoded = jwt.verify(token,SECRET_KEY);
            let ownerId = decoded.userId
            const stores = await Store.findAll({
                where: {
                    ownerId: ownerId,
                },
                include: [
                    {
                        model: Address,
                    },
                    {
                        model: Employee,
                        include: [{
                            model: User,
                        }],
                    }
                ]
            });
            if(stores===null || stores == undefined) return res.status(404).json({message: "Bạn không có cửa hàng nào cả"});
            
            return res.status(200).json(stores);
        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }
    }

    async getAllRequest(req,res){
        const bearer = req.get('Authorization');
        const token = bearer.substring(7);
        try{
            let decoded = jwt.verify(token,SECRET_KEY);
            let userId = decoded.userId;
            const stores = await Store.findAll({
                where: {
                    ownerId: userId
                },
                include: [Request]
            });
            return res.status(200).json(stores);
        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }
    }

    async acceptRequest(req,res){
        const bearer = req.get('Authorization');
        const token = bearer.substring(7);
        try{
            const userId = req.body.userId;
            const storeId = req.body.storeId;
            const response = req.body.response;
            let decoded = jwt.verify(token,SECRET_KEY);
            let id = decoded.userId;
            const user = await User.findOne({
                where: {
                    id: id
                }
            });
            if(user === null) return res.status(404).json({message: "Không tìm thấy tài khoản"});
            if(response === "Từ chối"){
                const request = await Request.update({
                    status: "Từ chối",
                },{
                    where: {
                        [Op.and]: [
                            {userId: userId},
                            {storeId: storeId}
                        ]
                    }
                })
                return res.status(200).json(request);
            }
            await Request.destroy({
                where: {
                    userId: userId,
                    storeId: storeId,
                }
            })
            const employee = await Employee.create({userId: userId,storeId: storeId});
            return res.status(200).json(employee);
        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }
    }

    async deleteEmployee(req,res){
        const bearer = req.get('Authorization');
        const token = bearer.substring(7);
        try{
            const userId = req.body.userId;
            const storeId = req.body.storeId;
            let decoded = jwt.verify(token,SECRET_KEY);
            let id = decoded.userId;
            const user = await User.findOne({
                where: {
                    id: id
                }
            });
            if(user === null) return res.status(404).json({message: "Không tìm thấy tài khoản"});
            await Employee.destroy({
                where: {
                    [Op.and]: [
                        {userId: userId},
                        {storeId: storeId}
                    ]
                    
                }
            })
            return res.status(200).json({message: "Đã thôi việc nhân viên"});

        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }
    }
}

module.exports = new UserController();