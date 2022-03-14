const express = require("express");
const mongoose = require("mongoose")

const app = express();

app.use(express.json())

const connect = () => {
    return mongoose.connect(
      "mongodb://127.0.0.1:27017/bank"
    );
  };

//creating schemas
const userSchema = new mongoose.Schema(
    {
       firstName : {type:String, required : true},
       middleName : {type : String},
       lastName : {type:String, required: true},
       age : {type:String, required:true},
       email:{type:String, required : true},
       address : {type:String, required:true},
       gender : {type:String, default:"Female"},
    },
    {
        versionKey : false,
        timestamps : true
    }

);

const User = mongoose.model("user",userSchema);


const branchSchema = new mongoose.Schema(
    {
        name : {type:String,required:true},
        address : {type:String, required:true},
        IFSC : {type:String, required:true},
        MICR : {type:Number, required:true},
    },
    {
        versionKey : false,
        timestamps : true
    }
);

const Branch = mongoose.model("branch",branchSchema )

const masterAccountSchema = new mongoose.Schema(
    {
        balance : {type:String, required:true},
        branch: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "branch",
            required:true
        },
    },
    {
        versionKey : false,
        timestamps : true
    }
);


const Masteraccount = mongoose.model("masteraccount",masterAccountSchema);


const savingsAccountSchema = new mongoose.Schema(
    {
        account_number :{type:String, required:true, unique:true},
        balance : {type:String, required: true},
        interestRate : {type:String, required:true},
    },
    {
        versionKey : false,
        timestamps : true
    }
);

const Savingsaccount = mongoose.model("savingsaccount",savingsAccountSchema);


const fixedAccountSchema = new mongoose.Schema(
    {
        account_number : {type:String, required:true, unique:true},
        balance : {type:String, required:true},
        interestRate : {type:String, required:true},
        startDate : {type:String, required:true},
        maturityDate : {type:String, required:true},
    },
    {
        versionKey : false,
        timestamps : true
    }
)

const Fixedaccount = mongoose.model("fixedaccount",fixedAccountSchema);

//GET API to get all the details of the master account 
//( here you will get the complete detail of the master account collection along with the full user detail )

app.get("/masteraccount",async (req,res)=>{
    const masteraccount = await Masteraccount.find().lean.exec();

    res.status(200).send(masteraccount);
});


//POST API for the user to create a SavingsAccount
app.post("/savingsaccount", async (req,res)=>{
    try{
        const savingsaccount = await Savingsaccount.create(req.body);
    res.status(200).send(savingsaccount);
    }
    catch(err){
        return res.status(500).send(err.message);
    }
})

// POST API for the user to create a FixedAccount
app.post("/fixedaccount", async (req,res)=>{
    try{
        const fixaccount = await Fixedaccount.create(req.body);
    res.status(200).send(fixaccount);
    }
    catch(err){
        return res.status(500).send(err.message);
    }
})




app.listen(5000, async () => {
    try {
      await connect();
      console.log("listening on port 5000");
    } catch (err) {
      console.log(err);
    }
    
  });