
import React, { Component } from 'react';
import Cookies from 'js-cookie';
class UpdateEmployee extends Component {
  state = {
    name: '',
    position: '',
    id: ''
    
  };
  
  onChangeId = (event) =>{
    this.setState({id: event.target.value})
  }
  
  onChangeName = (event) =>{
    this.setState({name: event.target.value})
  }
  
  onChangePosition = (event) =>{
    this.setState({position: event.target.value})
  }

  handleSubmitUpdate = async (event) => {
    event.preventDefault();
    const { name, position, id } = this.state;
    const employeeDetails = { name, position };
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeDetails)
    };
  
    try {
      const response = await fetch(`/employee/api/${id}`, options); // Corrected the URL string
      if (!response.ok) {
        throw new Error('Response put not ok');
      }
      alert(`Employee id: ${id} Data Update Successfully`)
      this.setState({ name: '', position: '', id: '' });
    } catch (error) {
      console.error(error);
    }
  }
  
  render() {
    const { name, position, id } = this.state;

    return (
      <div className='container mb-5'>
        <h2>Update Employee</h2>
        <form onSubmit={this.handleSubmitUpdate}>
          <div className="form-group">
          <label htmlFor="id">ID:</label>
            <input
              type="number"
              className="form-control"
              id="id"
              name="id"
              value={id}
              onChange={this.onChangeId}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="id">Name:</label>
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
          <button type="submit" className="btn btn-primary">Update Employee</button>
        </form>
      </div>
    );
  }
}

export default UpdateEmployee