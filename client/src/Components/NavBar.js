import React, { Component } from 'react';
import LogoSVG from './LogoSVG';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false,
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
  }

  render() {
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
            <nav id="nav-icons">
              <a className="nav-icon" href="/">
                <div className="nav-icon-text">Login</div>
              </a>
              <a className="nav-icon" href="/">
                <div className="nav-icon-text">Sign Up</div>
              </a>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default NavBar;
