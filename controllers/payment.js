const dotenv = require('dotenv');
const Razorpay = require('razorpay');
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

exports.createOrder = async(req,res,next)=>{
 const {amount,current, receipt} = req.body;
 
 try{
 const order = await razorpayInstance.orders.create({amount,current,receipt});
 console.log(order);
 res.json(order);
 }
 catch(e)
 {
    res.json(e);
 }
}