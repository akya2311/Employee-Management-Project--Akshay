

//**Admin page will be shown when**
//Username: akshay9022 & Password: akshay#5588 
//Username: akshay9022@gmail.com & Password: akshay9022 

//open terminal
//cd backend 
//node index.js 

//open new terminal
//cd myapp 
//npm start



import React, { Component } from "react";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom"
import EmployeesList from './EmployeesList';
class Home extends Component {
    state = {
        isLoggedIn: true,
        admin: [],
        username: '',
        password: '',
        showSubmitError: false,
        errorMsg: '',
        adminPanel: false
    }

    componentDidMount = async () => {
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
            this.setState({ isLoggedIn: false })
            await this.getAdmin(jwtToken);
        }
        
    }

    onChangeUsername = (event) => {
        this.setState({ username: event.target.value })
    }

    onChangePassword = (event) => {
        this.setState({ password: event.target.value })
    }

     getAdmin = async (jwtToken) => {
         const option = {
             headers: {
                 Authorization: `Bearer ${jwtToken}`,
             },
             method: 'GET',
         }
         try {
             const response = await fetch('/profile/', option);
             console.log(response.ok)
             if (response.ok) {
                this.setState({ adminPanel: true })
             }
             else{
                this.setState({adminPanel: false})
                throw new Error('Error fetching profile')
             } 
             }catch (error) {
             console.error(error)
         }
     }

    onSubmitSuccess = (jwtToken) => {
        Cookies.set('jwt_token', jwtToken, {
            expires: 30,
            path: '/',
        })
        this.setState({ isLoggedIn: false })
    }

    submitForm = async (event) => {
        event.preventDefault()
        const { username, password } = this.state

        if (username === '' || password === '') {
            this.setState({ errorMsg: 'Invalid username or password', showSubmitError: true })
        } else {
            const userDetails = { username, password }
            const url = '/login'
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data = await response.json()
            const jwtToken = data.jwtToken

            if (response.ok) {
                this.onSubmitSuccess(jwtToken)
                this.getAdmin(jwtToken)
            } else {
                this.setState({ showSubmitError: true, errorMsg: data })
            }
        }

        this.setState({ username: "", password: "" })
    }

    onClickLogin = () => {
        Cookies.remove('jwt_token')
        this.setState({adminPanel: false})
        this.setState({ isLoggedIn: true })
    }

    onClickLogout = () => {
        Cookies.remove('jwt_token')
        this.setState({adminPanel: false})
        this.setState({ isLoggedIn: true })
    }

    render() {
        const { username, password, errorMsg, showSubmitError, adminPanel, isLoggedIn } = this.state

        return (
            <div className="container mt-5">
                {isLoggedIn ? (
                    <div>
                        <div className="container d-flex justify-content-center flex-column">
                            <form onSubmit={this.submitForm} className="container">
                                <legend>Login User</legend>
                                <div className="mb-3" style={{ width: `500px` }}>
                                    <label htmlFor="UserName" className="form-label">UserName</label>
                                    <input type="text" id="UserName" className="form-control" placeholder="UserName" onChange={this.onChangeUsername} value={username} />
                                </div>
                                <div className="mb-3" style={{ width: `500px` }}>
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input className="form-control" type="password" id="password" placeholder="Password" onChange={this.onChangePassword} value={password} />
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                                <Link className="navbar-brand" to="/singup">
                                    <button className="btn btn-secondary"> Sign Up </button>
                                </Link>
                                {showSubmitError && <p style={{ color: 'red' }}>{errorMsg}</p>}
                            </form>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="container mt-5">
                            <div>
                                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                    <div className="container">
                                        <Link className="navbar-brand" to="/">Home</Link>
                                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                            <span className="navbar-toggler-icon"></span>
                                        </button>
                                        <div className="collapse navbar-collapse" id="navbarNav">
                                            <ul className="navbar-nav ml-auto">
                                                <li className="nav-item">
                                                    <button className="btn btn-danger mr-3" onClick={this.onClickLogout}>Log Out</button>
                                                </li>
                                                <li className="nav-item">
                                                    <button className="btn btn-primary mb-3" onClick={this.onClickLogin}>Login</button>
                                                </li>
                                                {adminPanel && (
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/admin">Admin Panel</Link>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <EmployeesList />
                    </div>
                )}
            </div>
        );
    }
}

export default Home;
