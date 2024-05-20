require('dotenv').config();
const app = require("./app");
const model = require('./models');

// start server

const startServer = async ()=>{
   try {

     app.listen(process.env.PORT || 5000, ()=>{
         console.log("server started on port  " + process.env.PORT);
     });

   } catch (error) {
    console.log("server setup failed: " + error);
   }
}

startServer();


