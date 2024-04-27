
/*Admin page will be shown when
Username: akshay9022@gmail.com & Password: akshay9022 */
 
//open terminal
//cd backend 
//node index.js 

//open new terminal
//cd myapp 
//npm start




import { Component } from 'react';
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Home from './Component/Home';
import SignUp from './Component/SignUp';
import Admin from './Component/Admin';
//import Redirect from 'redirect'
import './App.css';

class App extends Component{
  render(){
    return(
     <BrowserRouter>
      <Routes>
          <Route exact path='/' Component={Home} /> 
          {/* <Route exact path='/' Component={Login} />  */}

          <Route exact path='/admin' Component={Admin} /> 
          <Route exact path='/singup' Component={SignUp} />           
      </Routes>
      </BrowserRouter>
      
  
    )
  }
}


export default App;
