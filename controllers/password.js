exports.postForgotPassword = async(req,res,next)=>{
    try{
    const email = req.body.email;
    res.status(200).json({email});
    }
    catch(e)
    {
        res.json({e});
    }
}