import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import carsvg from '../login-car.svg';
import '../login_page.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null,
      showError: false,
      redirect: false,
    };

    this.formSubmit = this.formSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ redirect: localStorage.getItem('user-token') !== null });
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  formSubmit(e) {
    e.preventDefault();

    fetch('http://localhost:8081/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message !== undefined) {
          this.setState({ error: result.message, showError: true });
        } else {
          localStorage.setItem('user-token', result.token);
          this.setState({ redirect: true });
        }
      });
  }

  render() {
    const { error, showError, redirect } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />
        <div className="login-wrapper">
          <form onSubmit={this.formSubmit} className="login-form">
            <div className="title-wrapper">
              <span className="login-form-title">Sign In</span>
            </div>

            {!showError ? (
              ''
            ) : (
              <div className="error-text-wrapper">
                <span className="error-text">{error}</span>
              </div>
            )}

            <div className="input-wrapper">
              <input
                onChange={this.onChange}
                className="input"
                type="text"
                id="username"
                name="username"
                placeholder="username"
              />
            </div>

            <div className="input-wrapper">
              <input
                onChange={this.onChange}
                className="input"
                type="password"
                id="password"
                name="pass"
                placeholder="password"
              />
            </div>

            <div className="login-btn-wrapper">
              <button className="login-btn">Login</button>
            </div>

            <div className="smalltext-wrapper">
              <a href="/register" className="smalltext">
                Sign Up
              </a>
            </div>
          </form>
          <div className="login-pusher">
            <img
              src={carsvg}
              alt="girl sitting on car"
              height="80%"
              width="90%"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
