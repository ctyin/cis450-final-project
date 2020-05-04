import React, { Component } from 'react';
import NavBar from '../NavBar';
import '../../search_page.css';
import StatsForm from './StatsForm';

class StatsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />
        <StatsForm />
      </div>
    );
  }
}

export default StatsPage;