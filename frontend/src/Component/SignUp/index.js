import { Component } from "react";
import { Navigate } from "react-router-dom";

class SignUp extends Component {
  state = {
    email: "",
    username: "",
    password: "",
    showSubmitError: false,
    errorMsg: "",
    showLoginpage: false,
  };

  
  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }
  onChangeEmail = event => {
    this.setState({ email: event.target.value })
  }

  

  submitForm = async (event) => {
    event.preventDefault();
    const { email, username, password } = this.state;

    if ( email ==="" || username === "" || password === "") {
      this.setState({ showSubmitError: true });
      this.setState({ errorMsg: "Please fill in all fields" });
    } else {
      const userDetails = { email, username, password };
      const url = "/singup";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      };
      const response = await fetch(url, options);

      if (response.ok === true) {
        this.setState({ showLoginpage: true });
      } else {
        const message = await response.json();
        this.setState({
          showSubmitError: true,
          errorMsg: message.error || "Something went wrong",
        });
      }
    }
    this.setState({ email: "", username: "", password: "" });
  };

  render() {
    const { email,  username, password, errorMsg, showSubmitError, showLoginpage } =
      this.state;

    if (showLoginpage === true) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="container d-flex justify-content-center flex-column">
        <form onSubmit={this.submitForm} className="container">
          <legend>Sign up</legend>
          <div className="mb-3" style={{ width: `500px` }}>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="username"
              className="form-control"
              placeholder="Email"
              onChange={this.onChangeEmail}
              value={email}
            />
          </div>
          <div className="mb-3" style={{ width: `500px` }}>
            <label htmlFor="UserName" className="form-label">
              UserName
            </label>
            <input
              type="text"
              id="UserName"
              name="username"
              className="form-control"
              placeholder="UserName"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>
          <div className="mb-3" style={{ width: `500px` }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
          {showSubmitError ? (
            <p style={{ color: "red" }}>{errorMsg}</p>
          ) : null}
        </form>
      </div>
    );
  }
}

export default SignUp;
