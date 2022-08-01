
exports.getExpense = async(req,res,next)=>{
    res.json({success: true, isPremium: req.user.isPremium});
}