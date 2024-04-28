
import Cookies from 'js-cookie';
import React, { Component } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

class EmployeesList extends Component {
    state = {
        employees: [],
        apiStatus: apiStatusConstants.initial,
    }

    componentDidMount = async () => {
        this.fetchEmployee();
    }

    fetchEmployee = async () => {
        const jwtToken = Cookies.get('jwt_token')
        this.setState({
            apiStatus: apiStatusConstants.inProgress,
        })
        const option = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET'
        }
        try {
            const response = await fetch('/employee/api/', option);
            if (!response.ok) {
                this.setState({
                    apiStatus: apiStatusConstants.failure,
                })
                throw new Error('Error fetching employees')
            }
            const data = await response.json()
            this.setState({ employees: data, apiStatus: apiStatusConstants.success })
        } catch (error) {
            console.error(error)
        }
    }

    renderLoadingView = () => (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <ThreeDots color="#0b69ff" height={70} width={70} />
        </div>
    )

    renderFailureView = () => (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
                alt="all-products-error"
                className="products-failure-img"
            />
            <h1 className="product-failure-heading-text">
                Oops! Something Went Wrong
            </h1>
            <p className="products-failure-description">
                We are having some trouble processing your request. Please try again.
            </p>
        </div>
    )

    renderEmployeeView = () => {
        const { employees } = this.state
        return (
            <div>
                <h2>Employee List</h2>
                <table className="table" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <thead>
                    <tr>
                        <th style={{ 
                            color: '#333', // Dark gray color
                            fontWeight: 'bold', // Bold font weight
                            fontFamily: 'Arial, sans-serif' // Font family
                        }}>ID</th>
                        <th style={{ 
                            color: '#333', // Dark gray color
                            fontWeight: 'bold', // Bold font weight
                            fontFamily: 'Arial, sans-serif' // Font family
                        }}>Name</th>
                        <th style={{ 
                            color: '#333', // Dark gray color
                            fontWeight: 'bold', // Bold font weight
                            fontFamily: 'Arial, sans-serif' // Font family
                        }}>Position</th>
                    </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                            <td style={{ color: '#555', fontWeight: 'bold' }}>{employee.id}</td>
                            <td style={{ color: '#555', fontFamily: 'Arial, sans-serif' }}>{employee.name}</td>
                            <td style={{ color: '#555', fontStyle: 'italic' }}>{employee.position}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    renderAllView = () => {
        const { apiStatus } = this.state

        switch (apiStatus) {
            case apiStatusConstants.success:
                return this.renderEmployeeView()
            case apiStatusConstants.failure:
                return this.renderFailureView()
            case apiStatusConstants.inProgress:
                return this.renderLoadingView()
            default:
                return null
        }
    }

    render() {
        return (
            <div>
                {this.renderAllView()}
            </div>
        )
    }

}

export default EmployeesList;
