import React, { Component } from 'react';
import Cookies from 'js-cookie';
class AddEmployee extends Component {
  state = {
    name: '',
    position: ''
  };

  onChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  onChangePosition = (event) => {
    this.setState({ position: event.target.value });
  };

  onSubmitAdd = async (event) => {
    event.preventDefault();
    const { name, position } = this.state;
    const employeeDetails = { name, position };
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeDetails)
    };

    try {
      const response = await fetch('/employee/api/', options);
      if (!response.ok) {
        throw new Error('Response post not ok');
      }
      alert(`Employee ${name} : Added Successfully`)
      this.setState({ name: '', position: '' });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { name, position } = this.state;

    return (
      <div className="container mb-5">
        <h2 style={{ fontFamily: 'Arial, sans-serif', color: '#333', marginBottom: '20px' }}>Add Employee</h2>
        <form onSubmit={this.onSubmitAdd}>
          <div className="form-group">
            <label htmlFor="name" style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'bold' }}>Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={this.onChangeName}
              required
              style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'normal', borderRadius: '5px',width: "500px" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position" style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'bold' }}>Position:</label>
            <input
              type="text"
              className="form-control"
              id="position"
              name="position"
              value={position}
              onChange={this.onChangePosition}
              required
              style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'normal', borderRadius: '5px', width: "500px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', backgroundColor: '#007bff', borderColor: '#007bff' }}>Add Employee</button>
        </form>
      </div>
    );
  }
}

export default AddEmployee