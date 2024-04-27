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
        alert(`Employee id: ${name} Added Successfully`)
        this.setState({ name: '', position: '' });
      } catch (error) {
        console.error(error);
      }
    }
  
    render() {
      const { name, position } = this.state;
  
      return (
        <div className='container mb-5'>
          <h2>Add Employee</h2>
          <form onSubmit={this.onSubmitAdd}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                onChange={this.onChangeName}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position:</label>
              <input
                type="text"
                className="form-control"
                id="position"
                name="position"
                value={position}
                onChange={this.onChangePosition}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Employee</button>
          </form>
        </div>
      );
    }
  }

  export default AddEmployee