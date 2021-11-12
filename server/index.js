const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express()
const server = http.createServer(app);
const io = socketIo(server);
var session = require('express-session');
const port = process.env.PORT || 3001;

const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password:"",
    database:"chat_en_ligne"
});
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post("/insert", (req,res)=>{
    const pseudo = req.body.pseudo;
    if(pseudo){
        db.query('SELECT * FROM user WHERE pseudo = ? ', [pseudo], function(error, results, fields){

            if(results.length > 0){
                res.send("Pseudo deja utilisé");
                console.log("Pseudo deja utilisé");
            }
            if (!results.length > 0){

                const sql = "INSERT INTO  user(pseudo) VALUES (?)";
                db.query(sql, [pseudo], (err, result)=>{
                  console.log("Utilisateur créé avec success");
                  res.send(result)
                });
            }

        })
    }
    else{
        res.send('Please enter Pseudo');
        console.log("Please entrez votre Pseudo");
        res.end();
    }

});

app.post("/login" , (req, res)=>{
  
  var pseudo = request.body.pseudo;
  console.log(pseudo);
   if (pseudo ) {
      db.query('SELECT * FROM user WHERE pseudo = ? ', [pseudo], function(error, results, fields) {
          if (results.length > 0) {
              request.session.loggedin = true;
              request.session.pseudo = pseudo;
             
              // response.redirect('/home');
              response.send('connecté');
          } else {
              response.send('Incorrect Pseudo');
          }
          response.end();
      });
  }
   else {
      response.send('Please enter Pseudo');
      response.end();
  }

});









io.on('connection' , function(socket){
  console.log ("Un utilisateur s'est connecté");
  io.emit("Un utilisateur s'est connecté");

  socket.on('disconnect', function(){
      console.log ("Un utilisateur s'est déconnecté");
  });
  socket.on('chat message',  (msg)=>{
      console.log("message reçu :" + msg);
      io.emit('chat message' , msg);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
// app.listen(3001, ()=>{
//     console.log("running on port 3001");
// });