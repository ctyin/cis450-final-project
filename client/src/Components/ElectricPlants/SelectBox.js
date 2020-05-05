import React, { Component } from 'react';
import loading from '../../loading.gif';
import fuelData from '../../fuelmap.json';

class SelectBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.elementID,
      label: this.props.label,
      option: this.props.option,
      loading: true,
      items: [],
      showItems: false,
      func: this.props.setter,
      type: this.props.type,
      set: this.props.set,

      make: this.props.make,
      model: this.props.model,
      carYear: this.props.carYear,

      plantYear: this.props.plantYear,
      state: this.props.state,
      name: this.props.plantName,
      // fueltype: this.props.fueltype

      attempted: false,
    };


    this.clickDropdown = this.clickDropdown.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { set, type } = state;
    
    // check if the props have been changed
    if (props.set !== set) {
      if (type === 'model') {
        return {
          set: props.set,
          make: props.make,
          option: 'Model of Vehicle',
        };
      }

      if (type === 'carYear') {
        return {
          set: props.set,
          model: props.model,
          option: 'Year of Vehicle',
        }
      }
    }


    // reset if changed earlier part of form
    if (type === 'model' && props.make !== state.make) {
      return {
        set: props.set,
        make: props.make,
        option: 'Model of Vehicle',
      }
    }

    if (type === 'carYear' && (props.make !== state.make || props.model !== state.model)) {
      return {
        make: props.make,
        model: props.model,
        set: props.set,
      }
    }


    /********************   For plants   **********************/
    if (props.set !== set) {
      if (type === 'name') {
        return {
          set: props.set,
          plantYear: props.plantYear,
          state: props.state,
          option: 'Name of Plant',
        }
      }

      if (type === 'fuel') {
        return {
          set: props.set,
          plantYear: props.plantYear,
          state: props.state,
          name: props.plantName,
          option: "Fuel Source"
        }
      }
    }

    // reset if changed earlier part of form
    if (type === 'name' && (props.state !== state.state || props.plantYear !== state.plantYear)) {
      return {
        state: props.state,
        plantYear: props.plantYear,
        option: 'Name of Plant'
      }
    }

    if (type === 'fuel' && (props.state !== state.state ||
        props.plantYear !== state.plantYear || props.plantName !== state.name)) {
          return {
            state: props.state,
            plantYear: props.plantYear,
            name: props.plantName,
            option: 'Fuel Source'
          }
        }

    return null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    const { type, set } = this.state;

    if (type === 'make' && set) {
      let newMakes = [];
      fetch('http://localhost:8081/electricmakes')
        .then(res => res.json())
        .then(result => {
          for (let i = 0; i < result.rows.length; i++) {
            newMakes.push(
              <div key={`${result.rows[i][0]}--make-div`}>
                <div
                  key={`make-id-${result.rows[i][0]}`}
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
                </div>
                <div
                  key={`${result.rows[i][0]}--sep-make`}
                  className="items-box--seperater"
                ></div>
              </div>
            );
          }

          this.setState({
            items: newMakes,
            loading:false
          })
        })
        .catch(err => {
          console.log(err);
        })
    }

    if (type === 'plantYear' && set) {
      let newYears = [];
      fetch('http://localhost:8081/poweryears')
        .then(res => res.json())
        .then(result => {
          for (let i = 0; i < result.rows.length; i++) {
            newYears.push(
              <div key={`${result.rows[i][0]}--pyear-div`}>
                <div
                  key={`pyear-id-${result.rows[i][0]}`}
                  value={result.rows[i][0]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][0]}
                </div>
                <div
                  key={`${result.rows[i][0]}--sep-pyear`}
                  className="items-box--seperater"
                ></div>
              </div>
            );
          }

          this.setState({
            items: newYears,
            loading:false
          })
        })
        .catch(err => {
          console.log(err);
        })
    }

    if (type === 'state' && set) {
      let newStates = [];
      fetch('http://localhost:8081/states')
        .then(res => res.json())
        .then(result => {
          for (let i = 0; i < result.rows.length; i++) {
            newStates.push(
              <div key={`${result.rows[i][0]}--state-div`}>
                <div
                  key={`state-id-${result.rows[i][0]}`}
                  value={result.rows[i][0]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][0]}
                </div>
                <div
                  key={`${result.rows[i][0]}--sep-state`}
                  className="items-box--seperater"
                ></div>
              </div>
            );
          }

          this.setState({
            items: newStates,
            loading:false
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { type, set } = this.state;

    if (type === 'model' && set) {
      if (prevState.make !== this.state.make || !this.state.attempted) {
        let newModels = [];
        let make = this.props.make;
        if (make !== null) {
          fetch(`http://localhost:8081/electricmodels/${make}`)
            .then((res) => res.json())
            .then((result) => {
              for (let i = 0; i < result.rows.length; i++) {
                newModels.push(
                  <div key={`${result.rows[i][0]}-model--div`}>
                    <div
                      key={`model-id-${result.rows[i][0]}`}
                      value={result.rows[i][1]}
                      onClick={this.selectItem}
                      className="items-box--item"
                    >
                      {result.rows[i][1]}
                    </div>
                    <div
                      key={`${result.rows[i][0]}--sep-model`}
                      className="items-box--seperater"
                    ></div>
                  </div>
                );
              }
              this.setState({
                items: newModels,
                loading: false,
                attempted: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } 
      }
    }


    if (type === 'carYear' && set) {
      if (
        prevState.model !== this.state.model ||
        prevState.make !== this.state.make ||
        !this.state.attempted
      ) {
        let newYears = [];
        let make = this.props.make;
        let model = this.props.model;
        if (make !== null && model !== null) {
          fetch(`http://localhost:8081/years/${make}/${model}`)
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              for (let i = 0; i < result.rows.length; i++) {
                newYears.push(
                  <div key={`${result.rows[i][0]}-year--div`}>
                    <div
                      key={`year-id-${result.rows[i][0]}`}
                      value={result.rows[i][1]}
                      onClick={this.selectItem}
                      className="items-box--item"
                    >
                      {result.rows[i][1]}
                    </div>
                    <div
                      key={`${result.rows[i][0]}--sep-year`}
                      className="items-box--seperater"
                    ></div>
                  </div>
                );
              }
              this.setState({
                items: newYears,
                loading: false,
                attempted: true,
                option: 'Year of Vehicle',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }

    if (type === 'name' && set) {
      if (
        prevState.plantYear !== this.state.plantYear ||
        prevState.state !== this.state.state ||
        !this.state.attempted
      ) {
        let newNames = [];
        let plantState = this.props.state;
        let plantYear = this.props.plantYear;
        if (plantState !== null && plantYear !== null) {
          fetch(`http://localhost:8081/plantnames/${plantState}/${plantYear}`)
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              for (let i = 0; i < result.rows.length; i++) {
                newNames.push(
                  <div key={`${result.rows[i][0]}-pname--div`}>
                    <div
                      key={`pname-id-${result.rows[i][0]}`}
                      value={result.rows[i][0]}
                      onClick={this.selectItem}
                      className="items-box--item"
                    >
                      {result.rows[i][0]}
                    </div>
                    <div
                      key={`${result.rows[i][0]}--sep-pname`}
                      className="items-box--seperater"
                    ></div>
                  </div>
                );
              }
              this.setState({
                items: newNames,
                loading: false,
                attempted: true,
                option: 'Name of Plant',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }

    if (type === 'fuel' && set) {
      if (
        prevState.plantYear !== this.state.plantYear ||
        prevState.state !== this.state.state ||
        prevState.name !== this.state.name ||
        !this.state.attempted
      ) {
        let newFuels = [];
        let plantState = this.props.state;
        let plantYear = this.props.plantYear;
        let plantName = this.props.plantName;
        if (plantState !== null && plantYear !== null && plantName !== null) {
          fetch(`http://localhost:8081/plantfuel/${plantState}/${plantYear}/${plantName}`)
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              for (let i = 0; i < result.rows.length; i++) {
                newFuels.push(
                  <div key={`${result.rows[i][0]}-pname--div`}>
                    <div
                      key={`pname-id-${result.rows[i][0]}`}
                      value={result.rows[i][0]}
                      onClick={this.selectItem}
                      className="items-box--item"
                    >
                      {result.rows[i][0]}
                    </div>
                    <div
                      key={`${result.rows[i][0]}--sep-pname`}
                      className="items-box--seperater"
                    ></div>
                  </div>
                );
              }
              this.setState({
                items: newFuels,
                loading: false,
                attempted: true,
                option: 'Fuel Source',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }

  }

  UNSAFE_componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClickOutside = () => {
    this.setState({ showItems: false });
  };

  handleClick = (e) => {
    if (this.node.contains(e.target)) return;

    this.handleClickOutside();
  };

  clickDropdown(e) {
    e.preventDefault();

    this.setState((state, props) => ({
      showItems: !state.showItems,
    }));
  }

  selectItem(e) {
    if (this.state.type === 'fuel') {
      this.setState({ option: fuelData[e.target.innerHTML], showItems: false })
    } else {
      this.setState({ option: e.target.innerHTML, showItems: false });
    }

    this.state.func(e.target.innerHTML);
  }

  render() {
    return (
      <label
        ref={(node) => (this.node = node)}
        className={
          this.state.showItems
            ? 'search-label search-label--selected'
            : 'search-label search-label--deselected'
        }
        htmlFor={this.state.id}
        onClick={this.clickDropdown}
      >
        <input
          style={{ display: 'none' }}
          readOnly={true}
          value={this.state.option}
        ></input>
        <div className="search-label--label">{this.state.label}</div>
        <span className="search-option" id={this.state.id}>
          {this.state.option}
        </span>
        <div
          className={!this.state.showItems ? 'items-box hidden' : 'items-box'}
        >
          {!this.state.loading ? (
            this.state.items
          ) : (
            <img src={loading} alt="loading bars" height="80px" />
          )}
        </div>
      </label>
    );
  }
}

export default SelectBox;
