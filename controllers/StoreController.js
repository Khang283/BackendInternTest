const {Store,User,Address} = require('../models');
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../constant');

class StoreController{
    async createStore(req,res){
        const bearerToken = req.get('Authorization');
        const token = bearerToken.substring(7);
        const reqStore = req.body;
        try{
            let decode = jwt.verify(token,SECRET_KEY);
            let userId = decode.userId;
            const count = await Store.count({
                where: {
                    [Op.or]:[
                        {phone: reqStore.phone},
                        {email: reqStore.email}
                    ]
                }
            })
            if(count>1) return res.status(400).json({message: "Đã tồn tại store"});
            const user = await User.findOne({
                where: {
                    [Op.and]: [
                        {id: userId},
                        {userType: "Owner"}
                    ]
                }
            });
            if(user){
                let address = await Address.findOne({
                    where: {
                        houseNumber: reqStore.address.houseNumber,
                    }
                })
                if(address===null){{
                   address = await Address.create(reqStore.address); 
                }}
                const store = await Store.create({
                    name: reqStore.name,
                    logo: reqStore.logo || null,
                    phone: reqStore.phone,
                    email: reqStore.email,
                    ownerId: userId,
                    addressId: address.id,
                })
                return res.status(200).json(store);
            }
            return res.status(404).json({message: "Người dùng không tồn tại"});
        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }
    }

    async getStoreList(req,res){
        const ownerId = req.query.owner;
        try{
            const stores = await Store.findAll({
                where: {
                    ownerId: ownerId,
                },
                include: [Address]
            });
            return res.status(200).json(stores);
        }catch(e){
            console.log(e);
            return res.status(500).json({message: "Đã xảy ra lỗi"});
        }
    }
}

module.exports = new StoreController();