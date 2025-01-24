import express from 'express'
const app = express();
import connectDB from './config/db.js'
import User from './model/userSchema.js';
import bcrypt from 'bcrypt'
connectDB()
app.use(express.json());

app.get('/', (req, res) => {
    res.send("HEllo")
})
app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.send({ message: "User Already Exist" })
        }
        const hasshedPassword = await bcrypt.hash(password, 10)
        console.log(hasshedPassword);
        const userData = await User({ email, name, password: hasshedPassword })
        userData.save();
        res.send({ message: "User Created Successfully" })
    }
    catch (err) {
        res.send(err)
    }

})


app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const userExist=await User.findOne({email})
        const realpassword=await bcrypt.compare(password,userExist.password)
        if(!userExist){
          return       res.send({message:"User Not Found"})
        }
        if(realpassword){
            return res.send({message:"Login Successfully"})
        }
       res.send({message:"Invalid Credentials"})
    }
    catch(err){
        res.send(err)
    }
})

app.put('/update/:id',async(req,res)=>{
    const {id}=req.params
    const {email,name,password}=req.body

    try{
        const userExist=await User.findById({_id:id})
        if(!userExist){
            return res.send({message:"User Not Found"})
        }
        userExist.email=email;
        userExist.name=name;
        userExist.password=password;
        userExist.save();
        res.send({message:"User Updated Successfully"})
    }
    catch(err){
        res.send(err)
    }
})

app.delete('/delete/:id',async (req,res)=>{
    const {id}=req.params

    try{
        const userExist=await User.findByIdAndDelete({_id:id})
        if(!userExist){
                return res.send({message:"User not found "})
        }

        res.send({message:"User Deleted Successfully "})
        
    }
    catch(err){
        res.send(err)
    }


})

app.listen(4000, (req, res) => {
    console.log("Server is running")
})