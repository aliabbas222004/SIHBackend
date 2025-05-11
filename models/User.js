const mongoose=require('mongoose');
const {Schema}=mongoose;
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        match: /^[0-9]{10}$/,
    },
    address:{
        type:String,
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }

});

const User=mongoose.model('users',userSchema);
module.exports=User;