const express = require("express");
const app = express();
const connectDb = require("./config/db");
const userModel = require("./model/userSchema");
const bcrypt = require('bcrypt');
connectDb();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("HEllO");
});
app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.send({ message: "User Exist" });
    }
    const salt = await bcrypt.genSalt();
    console.log(salt);
    const hash_password = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hash_password });
    await newUser.save();
    return res.send({ message: "User Created Successfully" });
  }
  catch (err) {
   res.send(err)
  }
});
app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userDelete = await userModel.findOneAndDelete(id)
    if (userDelete) {
      res.status(404).json({ massege: "user deleted successfully" });
    }
    else {
      res.status(200).json({ massege: "user not exist" })
    }
  }
  catch (err) {
    console.err(err);
    res.status(500).json({ message: 'server error' });
  }
});
app.put('/update/:id', async (req, res) => {
  const itemId = req.params.id
  const updatedId = req.body
  console.log(itemId);
  console.log(updatedId);
  const userUpdate = await userModel.findByIdAndUpdate({ _id: itemId }, updatedId, { new: true })
  if (userUpdate) {
    res.send({ message: "User Updated Successfully" })
  }
  else {
    res.send({ message: "User not updated Successfully" })
  }
})


app.listen(4000, () => {
  console.log("Server is running... ");
});
