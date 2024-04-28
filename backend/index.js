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
      app.post('/login', async (req,res) =>{
        const {username, password} = req.body;
        const getUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
        const dbUser = await db.get(getUserQuery);
        if (dbUser === undefined){
          res.status(401)
          res.json('invalid user')
        }
        else{
          const passwordMatch = await bcrypt.compare(password, dbUser.password);
          if(passwordMatch === true){
            const payload = {
              username: username,
              role: dbUser.role
            }
            const jwtToken = jwt.sign(payload, 'MY_SECREAT_TOKEN')
            res.send({jwtToken})
          }
          else{
            res.status(401)
            res.json('invalid user')
          }
        }
      })
   
    //**Middleware Authentication**/
    const authenticateToken = (req, res, next) =>{
      let jwtToken;
      const authHeader = req.headers['authorization'];
      if (authHeader !== undefined){
        jwtToken = authHeader.split(' ')[1]
      }
      if(jwtToken === undefined){
        res.status(401)
        res.send('Invalid User')
      }
      else{
        jwt.verify(jwtToken, 'MY_SECREAT_TOKEN', (error, payload) =>{
          if(error){
            res.status(401)
            res.send('Invalid User')
          }
          else{
            req.username = payload.username
            next()
          }
        })
      }
    }

    const authenticateAdmin = (req, res, next) =>{
      let jwtToken;
      const authHeader = req.headers['authorization'];
      if (authHeader !== undefined){
        jwtToken = authHeader.split(' ')[1]
      }
      if(jwtToken === undefined){
        res.status(401)
        res.send('Invalid User')
      }
      else{
        jwt.verify(jwtToken, 'MY_SECREAT_TOKEN', (error, payload) =>{
          if(error){
            res.status(401)
            res.send('Invalid User')
          }
          else{
            if(payload.role === 'admin'){
              req.username = payload.username
              next()
            }
            else{
              res.status(401)
              res.send('Invalid Admin')
            }
            
          }
        })
      }
    }


    app.get("/profile/", authenticateAdmin, async (request, response) => {
      let { username } = request;
      const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
      try{
        const userDetails = await db.get(selectUserQuery);
        response.send(userDetails);
       }catch(error){
        console.error(error)
        response.status(401).send('get contact error')
       }
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

app.post('/employee/api/', authenticateToken, async (req,res) =>{
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

app.put('/employee/api/:id', authenticateToken, async (req,res) =>{
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

app.delete('/employee/api/:id',authenticateToken, async (req,res) =>{
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
