const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const multer = require("multer");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const path = require("path");
const cors = require('cors');



dotenv.config();

const connecttomongo = async()=>{
    await mongoose.connect(
        process.env.MONGO_URL,
        { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    
    console.log("Connected to MongoDB Here");
    
    
      
    
};

connecttomongo();


app.use("/images", express.static(path.join(__dirname, "public/images")));


app.use(cors({
  origin:"https://blue-pilot-frcad.pwskills.app:3000"
  // methods:["GET" , "POST" , "PUT" , "DELETE"] ,
}))
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});



const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
const PORT = process.env.PORT
console.log(PORT)
app.listen(8080, () => {
  console.log("Backend server is running at port 8080");
});