import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import Database from './connection/Database.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; 

const app = express();
//Api creation
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());
app.use(cors());
//datatbase connection
Database.connection()
 
//Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });


  const upload= multer({storage:storage})
  //creating endpoint images
  app.use('/images',express.static("upload/images"));

  app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url:`http://${host}:${port}/images/${req.file.filename}`
    });
    
  });

  //Schema for creating produdcts

  const Product =mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type: String,
        required:true
    },
      image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true
    }
  })
 app.post('/addproduct', async (req,res)=>{
           let products = await Product.find({});
           let id;
if (products.length > 0){
    let last_product = products[products.length - 1];
    id = last_product.id + 1;
} else {
    id = 1;
}

        const product=new Product({
            id:id,
            name:req.body.name,
            image:req.body.image,
            category:req.body.category,
            new_price:req.body.new_price,
            old_price:req.body.old_price,


        })
        console.log(product);
        await product.save();
        console.log("saved");
        res.json({
            success:true,
            name:req.body.name,
        })
 })
 //creating api for deleting product
 app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        sucess:true,
        name:req.body.name
    })

 })
 app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
 })
// creating schema for USer model
const Users =mongoose.model("Users",{
    
    name:{
        type: String,
    },
      email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    
    date:{
        type:Date,
        default:Date.now
    },
   
  })

  //cretaing endpoint for register user
  app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email }); // fixed "emial"
  
    if (check) {
      return res.status(400).json({ success: false, error: "Existing user found with the same email address" });
    }
  
    let Cart = {};
    for (let i = 0; i< 300; i++) {
      Cart[i] = 0;
    }
  
    const user = new Users({ 
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: Cart
    });
  
    await user.save();
  
    const data = {
      user: {
        id: user.id
      }
    };
  
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
  });
  //creting end point for user login
  app.post('/login', async (req, res) => {
    let user= await Users.findOne({ email: req.body.email }); 
    if(user){
        const passComapre =req.body.password=== user.password;
        if(passComapre){
            const data ={
                user:{
                    id:user.id

                }
            }
            const token =jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong passsword"})
        }

    }
    else{
        res.json({success:false,errors:"Wrong email id"})
    }
  })
//creating endpoint for newcollection data

 app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);

})

//creating end point for popular in women
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"Women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women");
    res.send(popular_in_women);

})
//cretaing middleware to fetchuser
const fetchUser= async(req,res,next)=>{
    const token= req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate valid token"})
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom')
            req.user = data.user;
            next();
        }catch (error){
            res.status(401).send({errors:"Please authenticate valid token"})

        }
    }
}

//creating end point for adding products in cart data
app.post('/addtocart',async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})
//creting endpoint for remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart")
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData)
    
})


 
app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
