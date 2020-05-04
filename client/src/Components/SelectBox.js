import React, { Component } from 'react';
import loading from '../loading.gif';

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
      attempted: false,
    };

    this.clickDropdown = this.clickDropdown.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.set !== state.set) {
      if (state.type === 4) {
        return {
          set: props.set,
          make: props.make,
          option: 'Model of Vehicle',
        };
      } else if (state.type === 5) {
        return {
          set: props.set,
          make: props.make,
          model: props.model,
          option: 'Year of Vehicle',
        };
      } else if (state.type === 2) {
        return {
          set: props.set,
          origin: props.origin,
          option: 'Destination City',
        };
      }
      return {
        set: props.set,
      };
    }

    if (state.type === 2 && props.origin !== state.origin) {
      return {
        set: props.set,
        origin: props.origin,
      };
    } else if (state.type === 4 && props.make !== state.make) {
      return {
        set: props.set,
        make: props.make,
      };
    } else if (
      state.type === 5 &&
      (props.make !== state.make || props.model !== state.model)
    ) {
      return {
        set: props.set,
        make: props.make,
        model: props.model,
      };
    }

    return null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    const { type, set } = this.state;

    if (type === 1 && set) {
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  data-id={result.rows[i][0]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}, {result.rows[i][4]}
                </div>
                <div
                  key={`${result.rows[i][0]}--sep-from-city`}
                  className="items-box--seperater"
                ></div>
              </div>
            );
          }
          this.setState({
            items: newCities,
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === 3 && set) {
      let newMakes = [];
      fetch('http://localhost:8081/allmakes')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newMakes.push(
              <div key={`${result.rows[i][0]}--make-div`}>
                <div
                  key={`make-id-${result.rows[i][0]}`}
                  data-id={result.rows[i][0]}
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
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { type, set } = this.state;

    if (type === 2 && set) {
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  data-id={result.rows[i][0]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}, {result.rows[i][4]}
                </div>
                <div
                  key={`${result.rows[i][0]}--sep-from-city`}
                  className="items-box--seperater"
                ></div>
              </div>
            );
          }
          this.setState({
            items: newCities,
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === 4 && set) {
      if (prevState.make !== this.state.make || !this.state.attempted) {
        let newModels = [];
        let make = this.props.make;
        if (make !== null) {
          fetch(`http://localhost:8081/models/${make}`)
            .then((res) => res.json())
            .then((result) => {
              for (let i = 0; i < result.rows.length; i++) {
                newModels.push(
                  <div key={`${result.rows[i][0]}-model--div`}>
                    <div
                      key={`model-id-${result.rows[i][0]}`}
                      data-id={result.rows[i][0]}
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
                option: 'Model of Vehicle',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else if (type === 5 && set) {
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
                      data-id={result.rows[i][0]}
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
    this.setState({ option: e.target.innerHTML, showItems: false });
    this.state.func(e.target.innerHTML, e.target.dataset.id);
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
