import React, { Component } from 'react';
import NavBar from '../NavBar';
import PlantsForm from './PlantsForm';
import '../search_page.css';

class PlantsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />
        <PlantsForm />
      </div>
    );
  }
}

export default PlantsPage;
