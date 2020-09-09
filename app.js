require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const mongoose2=require("mongoose");
const mongoose3=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(session({
  secret:"My secret",
  resave:"false",
  saveuninitialized:"false"
}));
app.use(passport.initialize());
app.use(passport.session());
/*console.log(process.env.SECRET);
console.log(process.env.API_KEY);*/
const conn1=mongoose.createConnection("mongodb+srv://Admin-Abhishek:abhishek.bahal7@cluster0.i3opr.mongodb.net/myExpDb",  { useNewUrlParser: true });
conn1.set("useCreateIndex",true);
const conn2=mongoose2.createConnection("mongodb+srv://Admin-Abhishek:abhishek.bahal7@cluster0.i3opr.mongodb.net/UserDb",  { useNewUrlParser: true });
conn2.set("useCreateIndex",true);
/*const conn3=mongoose3.createConnection("mongodb+srv://Admin-Abhishek:abhishek.bahal7@cluster0.i3opr.mongodb.net/my_Patients",{ useNewUrlParser: true } );
conn3.set("useCreateIndex",true);*/
const doctorSchema={
  name:String,
  content:String
};
/*const IdSchema= new mongoose.Schema({
  Id:String
})
const NameSchema= new mongoose.Schema({
  Name:String
})
const SymptomSchema= new mongoose.Schema({
  Symptom:String
})
const MedSchema= new mongoose.Schema({
  Medication:String
})*/
const userSchema=new mongoose.Schema({
  email:String,
  password:String,
  googleId:String,
  patientId:String,
  patientName:String,
  patientSymptom:String,
  patientMedication:String
});
/*const patientSchema={
  Id:String,
  name:String,
  symptoms:String,
  medication:String
}*/
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
//const secret=process.env.SECRET;

const User= conn2.model("User",userSchema);
const user1=new User({
  email:"help@help.com",
  password:"qwerty",
  googleId:"9875243",
  patientId:"123456",
  patientName:"Kumar",
  patientSymptom:"None Yet",
  patientMedication:"Crocine"
})
passport.use(User.createStrategy());


// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
const Person=conn1.model("Person",doctorSchema);

const p1=new Person({
  name:"Roshan",
  content:"https://www.twilio.com/docs/video/javascript-getting-started"
})
const p2=new Person({
  name:"Lal",
  content:"https://www.twilio.com/docs/video/javascript-getting-started"
})
const p3=new Person({
  name:"Yogi",
  content:"https://github.com/opentok/learning-opentok-node/blob/master/app.js"
})
const d1=new User({
  email:"ab@cd.com",
  password:"qwerty"
})
/*const Patient=conn3.model("Patient",patientSchema);
const pat1=new Patient({

  Id:"123456",
  name:"Demo",
  symptoms:"Not yet!Never will",
  medication:"None prescribed"

})
const pat2=new Patient({

  Id:"197956",
  name:"Dashhh",
  symptoms:"holla",
  medication:"None prescribed"

})*/
const defPersons=[p1];
const defUsers=[d1];
//const defPatients=[pat1,pat2];

const currentDate=require(__dirname+"/date.js")
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.get("/",function(req,res)
{

    let day=currentDate.getDate();
    res.render("home",{today:day,info:homeStartingContent});
})
app.get("/auth/google",
  passport.authenticate("google",{scope:["profile"]})
);
app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: '/LogIn' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });


app.get("/allergist",function(req,res)
{

Person.find({},function(err,results)
{
  if(results.length===0)
  {
    Person.insertMany(defPersons,function(err)
    {
      if(!err)
      {
        console.log("Successfully added");
      }
    })
    res.redirect("/allergist");
  }
  else
   {
      res.render("allergist",{found:results});
   }

})
Person.updateMany({name:"Roshan" ,name:"Tomar"},
    {content:"https://github.com/opentok/learning-opentok-node/blob/master/app.js",name:"Mr.X"}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Docs : ", docs);
    }
});

})

/*app.get("/allergist",function(req,res)
{
  res.render("allergist");
})*/
app.post("/allergist",function(req,res)
{
  const newPerson=req.body.newPerson;
  const about=req.body.aboutPerson;
  const person=new Person({
    name:newPerson,
    content:about
  })
  if(req.body.Password==="Qwerty")
  {
    person.save();
    res.redirect("/allergist")
  }
  else {
    res.write("Sorry!Invalid Password access!");
  }
  var myquery = { name: req.body.RemovePerson };
  if(req.body.RemovalPassword==="Abhishek")
  {


    Person.deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log( " document(s) deleted");
  //    res.send("/delete");
    });
  }
})

/*app.post("/delete",function(req,res)
{

  if(req.body.DelPassword==="Qwerty")
  {

  const checkedPerson=req.body.button;
  Person.findByIdAndRemove(checkedPerson,function(err)
  {

     if(!err)
     {
       console.log("Successfully deleted checked person!");
     }


  })
  }
  else
   {
  console.log("Not Entered correct!");
   }

})*/
app.get("/about",function(req,res)
{
  res.render("about",{aboutus:aboutContent});
})

app.get("/contact",function(req,res)
{
  res.render("contact",{contactat:contactContent});
})

app.get("/Signup",function(req,res)
{
  res.render("Signup");
})
app.get("/secrets",function(req,res)
{
  if(req.isAuthenticated())
  {
    res.render("secrets");
  }
  else {
    res.redirect("LogIn");
  }
})
var array=[user1];
app.get("/Add",function(req,res)
{
  if(req.isAuthenticated())
  {
    User.find({},function(err,results)
    {
      if(results.length===0)
      {
        User.insertMany(array,function(err)
        {
          if(!err)
          {
            console.log("Successfully added the user");
          }
        })
        res.redirect("/secrets");
      }
      else
       {
          res.render("Add",{found:results});
       }

    })


  }
  else {
    res.redirect("LogIn");
  }
})

app.post("/Add",function(req,res)
{
const submittedId=req.body.secretId;
const submittedName=req.body.secretName;
const submittedSymptom=req.body.secretSymptom;
const submittedMed=req.body.secretMed;


//console.log(req.user.id);
User.findById(req.user.id,function(err,foundUser)
{
  console.log("In the fn");
  if(err)
  {
    console.log(err);
  }
  else {
    if (foundUser) {
      var a=foundUser;
      console.log("found");

      a.patientId=submittedId;
      a.patientName=submittedName;
      a.patientSymptom=submittedSymptom;
      a.patientMedication=submittedMed;
      const newUser=new User({
        email:a.email,
        password:a.password,
        googleId:a.googleId,
        patientId:  a.patientId,
        patientName:a.patientName,
        patientSymptom:a.patientSymptom,
        patientMedication:a.patientMedication
      })
      //array.push(a);

      newUser.save(function()
    {


      res.redirect("/secrets");
      console.log(array);
    })
    }
    else {
      console.log("not found");
    }
  }
})

})
app.post("/Signup",function(req,res)
{
  User.register({username:req.body.username},req.body.password,function(err,user)
{
  if (err) {
    console.log(err);
    res.redirect("Signup");
  }
  else {
    passport.authenticate("local")(req,res,function(){
      res.redirect("secrets");
    })
  }
})

})
app.get("/LogIn",function(req,res)
{

res.render("LogIn");
})
app.get("/LogOut",function(req,res)
{
  req.logout();
  res.redirect("/");
})
app.post("/LogIn",function(req,res)
{
  const user=new User({
    username:req.body.username,
    password:req.body.password
  })
    req.login(user,function(err)
  {
    if(err)
    {
      console.log(err);
    }
    else {
      passport.authenticate("local")(req,res,function(){
        res.redirect("secrets");
    })
  }
  })

  //console.log("hi");//entered here

app.post("/secrets",function(req,res)
{



})
})
app.listen(8000,function()
{
  console.log("Server started at port 8000!");
})
