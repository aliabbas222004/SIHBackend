const mongoose=require('mongoose');
const {Schema}=mongoose;
const itemSchema = new Schema({
    id:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:"General"
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    dimensions:{
        length:{
            type:Number,
            required:true,
        },
        height:{
            type:Number,
            required:true,
        },
        width:{
            type:Number,
            required:true,
        }
    },
    images:{
        type:[String],
        required:true,
    },
    qrcodeLink:{
        type:String,
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('items',itemSchema);