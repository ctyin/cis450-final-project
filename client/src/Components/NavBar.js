import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import LogoSVG from './LogoSVG';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false,
      token: null,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const isTop = window.scrollY <= 0;
      if (!isTop) {
        this.setState({ scrolled: true });
      } else {
        this.setState({ scrolled: false });
      }
    });

    if (localStorage.getItem('user-token') !== null) {
      const token = jwt_decode(localStorage.getItem('user-token'));
      this.setState({ token: token });
    }
  }

  logout = (e) => {
    e.preventDefault();

    localStorage.removeItem('user-token');

    this.setState({ token: null });
  };

  render() {
    const { token } = this.state;
    let loggedIn = false;
    let name = '';

    if (token) {
      loggedIn = true;
      name = token.firstname;
    }

    return (
      <header className={this.state.scrolled ? 'scrolled' : 'not-scrolled'}>
        <div className="header-wrapper">
          <a className="logo-wrapper" aria-label="carbon homepage" href="/">
            <div>
              <LogoSVG />
            </div>
          </a>
          <div id="nav-spacer"></div>
          <div id="nav-wrapper">
            {loggedIn ? (
              <nav id="nav-icons">
                <a className="nav-icon" onClick={this.logout}>
                  <div className="nav-icon-text">Logout</div>
                </a>
                <a className="nav-icon" href="/">
                  <div className="nav-icon-text">Hi, {name}!</div>
                </a>
              </nav>
            ) : (
              <nav id="nav-icons">
                <a className="nav-icon" href="/login">
                  <div className="nav-icon-text">Login</div>
                </a>
                <a className="nav-icon" href="/register">
                  <div className="nav-icon-text">Sign Up</div>
                </a>
              </nav>
            )}
          </div>
        </div>
      </header>
    );
  }
}

export default NavBar;
