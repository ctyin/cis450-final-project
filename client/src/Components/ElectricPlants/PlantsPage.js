import React, { Component } from 'react';
import NavBar from '../NavBar';
import PlantsForm from './PlantsForm';
import PlantsResults from './PlantsResults'
import '../../plant_page.css';
import carPic from '../../electric_car.svg'

class PlantsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carId: null,
      ppId: null,
      ppYear: null,
      fueltype: null,
      primemover: null,
      display: false,
    }
  }

  formSubmit = (carId, ppId, ppYear, fueltype, primemover) => {
    this.setState({
      carId: carId,
      ppId: ppId,
      ppYear: ppYear,
      fueltype: fueltype,
      primemover: primemover,
      display: true,
    });
  }

  render() {

    const { carId, ppId, ppYear, fueltype, primemover } = this.state;

    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />
        <PlantsForm func={this.formSubmit} />

        {this.state.display ? (
          <PlantsResults
          carId={carId}
          ppId={ppId}
          ppYear={ppYear}
          fueltype={fueltype}
          primemover={primemover}
          />
        ) : (
          <div className="starter-content">
            <h3>Find electric cars and powerplants with better ratings!</h3>
            <img src={carPic} alt='elon'/>
          </div>
        )}
      </div>
    );
  }
}

export default PlantsPage;
