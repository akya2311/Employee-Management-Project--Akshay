
import React, { Component } from 'react';
import AddEmployee from './AddEmployee';
import UpdateEmployee from './UpdateEmployee';
import DeleteEmployee from './DeleteEmployee';
import { Link } from 'react-router-dom';
class Admin extends Component {
  render() {
    return (
      <div className='container mt-5'>
        <Link className="home" to="/">
          <button
            style={{
              fontFamily: 'Arial, sans-serif',
              color: '#fff',
              fontWeight: 'bold',
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Home
          </button>
        </Link>

        <AddEmployee />
        <UpdateEmployee />
        <DeleteEmployee />
      </div>
    );
  }
}

export default Admin;
