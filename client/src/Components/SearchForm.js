import React, { Component } from 'react';
import SelectBox from './SelectBox';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      origin: null,
      destination: null,
      make: null,
      model: null,
      year: null,
      func: this.props.func,
      setDest: false,
      setModel: false,
      setYear: false,
      originID: null,
      destID: null,
      carID: null,
    };

    this.originSet = this.originSet.bind(this);
    this.destSet = this.destSet.bind(this);
    this.makeSet = this.makeSet.bind(this);
    this.modelSet = this.modelSet.bind(this);
    this.yearSet = this.yearSet.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // update state for items
    if (this.state.origin !== prevState.origin) {
      this.setState({ setDest: true, destination: null });
    }

    if (this.state.make !== prevState.make) {
      this.setState({ setModel: true, model: null });
      if (this.state.model !== prevState.model) {
        this.setState({ setYear: true, year: null });
      }
    }

    if (this.state.model !== prevState.model) {
      this.setState({ setYear: true, year: null });
    }
  }

  originSet(choice, cityID) {
    this.setState({ origin: choice, originID: cityID });
  }

  destSet(choice, cityID) {
    this.setState({ destination: choice, destID: cityID });
  }

  makeSet(choice, vehicleID) {
    this.setState({ make: choice });
  }

  modelSet(choice, vehicleID) {
    this.setState({ model: choice });
  }

  yearSet(choice, vehicleID) {
    this.setState({ year: choice, carID: vehicleID });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { originID, destID, carID } = this.state;

    this.state.func(originID, destID, carID);
  };

  render() {
    const allActive =
      this.state.origin !== null &&
      this.state.destination !== null &&
      this.state.model !== null &&
      this.state.make !== null &&
      this.state.year !== null;

    return (
      <div className="container">
        <form action="get" role="search" onSubmit={this.handleSubmit}>
          <div className="search-wrapper">
            <div className="search-inputs">
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={1}
                    setter={this.originSet}
                    label="Origin"
                    option="Origin City"
                    elementID="source"
                    set={true}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={2}
                    setter={this.destSet}
                    label="destination"
                    option="Destination City"
                    elementID="dest"
                    set={this.state.setDest}
                    origin={this.state.origin}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={3}
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
                    type={4}
                    setter={this.modelSet}
                    option="Model of Vehicle"
                    label="Model"
                    elementID="model"
                    set={this.state.setModel}
                    make={this.state.make}
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    type={5}
                    setter={this.yearSet}
                    label="Year"
                    option="Year of Vehicle"
                    elementID="year"
                    set={this.state.setYear}
                    make={this.state.make}
                    model={this.state.model}
                  />
                </div>
              </div>
            </div>
            <div className="search-button">
              <button
                className={allActive ? 'search--btn' : 'search--btn-disabled'}
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
        </form>
      </div>
    );
  }
}

export default SearchForm;
