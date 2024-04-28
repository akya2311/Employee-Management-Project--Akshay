
import React, { Component } from 'react';
import Cookies from 'js-cookie';
class UpdateEmployee extends Component {
  state = {
    name: '',
    position: '',
    id: ''

  };

  onChangeId = (event) => {
    this.setState({ id: event.target.value })
  }

  onChangeName = (event) => {
    this.setState({ name: event.target.value })
  }

  onChangePosition = (event) => {
    this.setState({ position: event.target.value })
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
      <div className="container mb-5">
        <h2 style={{ fontFamily: 'Arial, sans-serif', color: '#333', marginBottom: '20px' }}>Update Employee</h2>
        <form onSubmit={this.handleSubmitUpdate}>
          <div className="form-group">
            <label htmlFor="id" style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'bold' }}>ID:</label>
            <input
              type="number"
              className="form-control"
              id="id"
              name="id"
              value={id}
              onChange={this.onChangeId}
              required
              style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'normal', borderRadius: '5px', width: "500px" }}
            />
          </div>
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
              style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontWeight: 'normal', borderRadius: '5px', width: "500px"}}
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
              style={{
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                fontWeight: 'normal',
                borderRadius: '5px',
                fontSize: '16px',
                width: "500px"
              }}
            />

          </div>
          <button type="submit" className="btn btn-primary" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', backgroundColor: '#28a745', borderColor: '#28a745' }}>Update Employee</button>

        </form>
      </div>
    );
  }
}

export default UpdateEmployee