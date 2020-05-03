import React, { Component } from 'react';
import SelectBox from './SelectBox.js';

class PlantsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // car state
      make: null,
      model: null,
      carYear: null,
      carId: null,

      // powerplant state
      ppYear: null,
      ppState: null,
      ppName: null,
      fueltype: null,
      ppId: null,
      nucId: null,
      prime_mover: null,
      
      // functions
      func: this.props.func
    };

    // this.originSet = this.originSet.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // update state for items
  }

  makeSet(choice) {
    this.setState({ make: choice });
  }

  modelSet(choice) {
    this.setState({ model: choice });
  }

  carYearSet(choice) {
    this.setState({ carYear: choice });
  }

  /* The plan is to do these implicitly (based on user reqs and whatever matches) */
//   carIdSet(choice) {
//     this.setState({ carId: choice });
//   }

  ppYearSet(choice) {
    this.setState({ ppYear: choice });
  }

  ppStateSet(choice) {
    this.setState({ ppState: choice });
  }

  ppNameSet(choice) {
    this.setState({ ppName: choice });
  }

  fuelTypeSet(choice) {
    this.setState({ fueltype: choice });
  }

  /* The plan is to do these implicitly (based on user reqs and whatever matches) */
//   ppIdSet(choice) {
//     this.setState({ ppId: choice });
//   }

//   nucIdSet(choice) {
//     this.setState({ nucId: choice });
//   }

//   primeMoverSet(choice) {
//     this.setState({ model: choice });
//   }

  handleSubmit = (e) => {
    e.preventDefault();

    // const { origin, destination, make, model, year } = this.state;

    // this.state.func(origin, destination, make, model, year);
  };

  render() {
    const carComplete =
      this.state.make !== null &&
      this.state.model !== null &&
      this.state.carYear !== null;
      
    const plantComplete =
      this.state.ppYearSet !== null &&
      this.state.ppStateSet !== null &&
      this.state.ppNameSet !== null &&
      this.state.fuelTypeSet !== null;

    const { originItems } = this.state;

    return (
      <form action="get" role="search" onSubmit={this.handleSubmit}>
      
      <div className="container">
          <div className="search-wrapper">
            <div className="search-inputs">
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={1}
                    setter={this.makeSet}
                    label="Make"
                    option="Make of Vehicle"
                    elementID="make"
                    set={true}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={2}
                    setter={this.modelSet}
                    label="Model"
                    option="Model of Vehicle"
                    elementID="model"
                    set={false}
                  />
                </div>
              </div>
            <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={1}
                    setter={this.makeSet}
                    label="Make"
                    option="Make of Vehicle"
                    elementID="make"
                    set={true}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={2}
                    setter={this.modelSet}
                    label="Model"
                    option="Model of Vehicle"
                    elementID="model"
                    set={false}
                  />
                </div>
              </div>
            </div>
            <div className="search-button">
              <button
                className={carComplete ? 'search--btn' : 'search--btn-disabled'}
                type="submit"
              >
                <span className="search--btn-wrap">
                  <span>
                    <svg
                      style={{
                        display: 'block',
                        fill: 'none',
                        height: '12px',
                        width: '12px',
                        stroke: 'currentColor',
                        strokeWidth: '5.333333333333333',
                        overflow: 'visible',
                        marginRight: '5px',
                      }}
                      aria-hidden="true"
                      role="presentation"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="none">
                        <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                      </g>
                    </svg>
                  </span>
                  <span>Calculate</span>
                </span>
              </button>
            </div>
        </div>
        
        </div>
    </form>
    );
  }
}

export default PlantsForm;