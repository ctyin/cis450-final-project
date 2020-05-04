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
      
      // functions
      func: this.props.func,

      setModel: false,
      setYear: false,

      setName: false,
      setFuel: false,
    };

    this.makeSet = this.makeSet.bind(this);
    this.modelSet = this.modelSet.bind(this);
    this.carYearSet = this.carYearSet.bind(this);

    this.ppYearSet = this.ppYearSet.bind(this);
    this.ppStateSet = this.ppStateSet.bind(this);
    this.ppNameSet = this.ppNameSet.bind(this);
    this.fuelTypeSet = this.fuelTypeSet.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // update state for items

    if (this.state.make !== prevState.make) {
      this.setState({ setModel: true, model: null });
    }

    if (this.state.model !== prevState.model) {
      this.setState({ setYear: true, year: null });
    }


    /****** FOR PLANTS ******/
    if (this.state.plantYear !== prevState.plantYear || this.state.ppState !== prevState.ppState) {
      this.setState({ setName: true, ppName: null, setFuel: false, fueltype: null })
    }

    if (this.state.ppName !== prevState.ppName) {
      this.setState({ setFuel: true, fueltype: null})
    }

    
    /****** FETCH QUERY INPUTS USING FORM INPUTS ******/
    const carComplete =
      this.state.make !== null &&
      this.state.model !== null &&
      this.state.carYear !== null;
      
    const plantComplete =
      this.state.ppYear !== null &&
      this.state.ppState !== null &&
      this.state.ppName !== null &&
      this.state.fueltype !== null;

    if (plantComplete) {
        const reqOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            year: this.state.ppYear,
            state: this.state.ppState,
            name: this.state.ppState,
            fuel: this.state.fueltype,
          }),
        };
      
        console.log(reqOptions.body);

        fetch('http://localhost:8081/plantPairsInputs', reqOptions)
        .then(res => res.json())
        .then((result) => {
          
        });
    }

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
      this.state.ppYear !== null &&
      this.state.ppState !== null &&
      this.state.ppName !== null &&
      this.state.fueltype !== null;

    const { originItems } = this.state;

    return (
      <form action="get" role="search" onSubmit={this.handleSubmit}>
      
      <div className="container">
          <div className="search-wrapper">
            <div className="search-inputs">
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={'make'}
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
                    type={'model'}
                    setter={this.modelSet}
                    label="Model"
                    option="Model of Vehicle"
                    elementID="model"
                    make={this.state.make}
                    set={this.state.setModel}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={'carYear'}
                    setter={this.carYearSet}
                    label="Car Year"
                    option="Year of Vehicle"
                    elementID="year"
                    set={this.state.setYear}
                    make={this.state.make}
                    model={this.state.model}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row-spacer"/>

        <div className="container">
          <div className="search-wrapper">
            <div className="search-inputs">
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={'plantYear'}
                    setter={this.ppYearSet}
                    label="plant Year"
                    option="Year of Operation"
                    elementID="ppyear"
                    set={true}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={'state'}
                    setter={this.ppStateSet}
                    label="State"
                    option="State of Plant"
                    elementID="state"
                    set={true}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={'name'}
                    setter={this.ppNameSet}
                    label="Name"
                    option="Name of Plant"
                    elementID="name"
                    plantYear={this.state.ppYear}
                    state={this.state.ppState}
                    set={this.state.setName}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={'fuel'}
                    setter={this.fuelTypeSet}
                    label="Fuel type"
                    option="Fuel Source"
                    elementID="fuel"
                    plantYear={this.state.ppYear}
                    state={this.state.ppState}
                    plantName={this.state.ppName}
                    set={this.state.setFuel}
                  />
                </div>
              </div>
            </div>
            <div className="search-button">
              <button
                className={carComplete && plantComplete ? 'search--btn' : 'search--btn-disabled'}
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