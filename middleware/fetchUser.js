const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET; 

const fetchUser=(req,res,next)=>{
    const token=req.header('userToken');
    if(!token){
        res.status(401).send({error:"Invalid token"});
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"Invalid token"});
    }
}

module.exports=fetchUser;