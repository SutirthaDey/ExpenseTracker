const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const Order = require('../models/order');
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

exports.createOrders = async(req,res,next)=>{
 const amount = 2000;
 const currency = "INR";
 const receipt = 'rcp1';

 console.log('####',amount);

 try{
 const order = await razorpayInstance.orders.create({amount,currency,receipt});
 await req.user.createOrder({orderId: order.id, status: 'Pending'});
 res.json({order,key:process.env.RAZORPAY_ID});
 }
 catch(e)
 {
    res.status(400).json(e);
 }
}

exports.verifyOrder = async(req,res,next)=>{
    const {orderId,paymentId} = req.body;

    try{
    const order =  await Order.findOne({where : {orderId: orderId}});
    await order.update({paymentId:paymentId, status:'Successful'});
    req.user.update({isPremium: true});
    return res.status(202).json({sucess: true, message: "Transaction Successful"});
    }catch(e){
        console.log(e);
        res.status(403).json({ errpr: e, message: 'Something went wrong' })
    }
}