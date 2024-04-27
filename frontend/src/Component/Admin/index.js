
import React, { Component } from 'react';
import AddEmployee from './AddEmployee';
import UpdateEmployee from './UpdateEmployee';
import DeleteEmployee from './DeleteEmployee';
import {Link } from "react-router-dom"
class Admin extends Component {
  render() {
    return (
      <div className='container'>
        <Link className="home" to="/">Home</Link>
        <AddEmployee />
        <UpdateEmployee />
        <DeleteEmployee />
      </div>
    );
  }
}

export default Admin;
