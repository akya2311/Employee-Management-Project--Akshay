const express = require('express');
const app = express();
app.use(express.json())
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const { exit } = require('process');
const dbPath = path.join(__dirname, 'user.db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connectDbAndServer = async () =>{
    try{
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      })
      app.listen(5000, ()=>{
        console.log('DB connect server http://localhost:5000/')
      })
  
      }catch (e){
        console.log(`DB Error ${e.message}`)
        exit(1)
      }
    }
      
connectDbAndServer()

    app.post("/singup", async (request, response) => {
      const { email, username, password, role } = request.body;
      const selectUserQuery = `SELECT * FROM user WHERE email = '${email}' AND username = '${username}'`;
      const dbUser = await db.get(selectUserQuery);
      if (dbUser === undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUserQuery = `
          INSERT INTO user (email, username, password, role)
          VALUES (
            '${email}',
            '${username}',
            '${hashedPassword}',
            '${role}'
          );
          `;
          try{
            const dbResponse = await db.run(createUserQuery);
            const newUserId = dbResponse.lastID;
             response.send(`Created new user with ${newUserId}`);
           }catch(error){
            console.error(error)
            response.status(401).send('get contact error')
           }
      }
      else{
        response.status(401);
        response.json(`${username} user already exists`);
        
      }
      });

    app.post("/login", async (request, response) => {
      const { username, password } = request.body;
      const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
      const dbUser = await db.get(selectUserQuery);
       if (dbUser === undefined) {
        response.status(401);
        response.json(`Invalid User`);
      } else {
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        
        if (isPasswordMatched === true) {
          const payload = {
            username: username,
          };
          const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
          response.send({ jwtToken, dbUser });
        } else {
          response.status(401);
          response.json(`Invalid User`);
        }
      }
    });

   
    //**Middleware Authentication**/

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

app.get("/profile/", authenticateToken, async (request, response) => {
  let { username } = request;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const userDetails = await db.get(selectUserQuery);
  response.send(userDetails);
});

app.get('/employee/api/', authenticateToken, async (req,res) =>{
  const allContactQuery = `SELECT * FROM employee`;
  try{
   const dbAllContacts = await db.all(allContactQuery);
   res.send(dbAllContacts)
  }catch(error){
   console.error(error)
   res.status(401).send('get contact error')
  }
  
})

app.post('/employee/api/', async (req,res) =>{
 const {name, position} = req.body
 const createEmployeeQuery = `
 INSERT INTO employee (name, position)
 VALUES(
   '${name}',
   '${position}'
 )
 `
 try{
   const dbCreateEmployee = await db.run(createEmployeeQuery);
   const id = dbCreateEmployee.lastID;
   res.send(`create contact by id ${id}`)
 }catch(error){
   console.error(error)
   res.status(401).send('create contact error')
  }
})

app.put('/employee/api/:id', async (req,res) =>{
 const {id} = req.params;
 const {name, position} = req.body;
 const updateEmployeeQuery = `
 UPDATE 
 employee
 SET 
 name = ?,
 position = ?
 WHERE id = ?
 `;
 try{
   await db.run(updateEmployeeQuery, [name, position, id])
   res.send('employee update')
 }catch(error){
   console.error(error)
   res.status(401).send('update employee error')
  }
})

app.delete('/employee/api/:id', async (req,res) =>{
 const {id} = req.params;
 const deleteEmployeeQuery = `
 DELETE
  FROM employee
  WHERE id = ${id}
 `
 try{
   await db.run(deleteEmployeeQuery);
   res.send('delete contact')
 }catch(error){
   console.error(error)
   res.status(401).send('delete contact error')
  }

 
})
