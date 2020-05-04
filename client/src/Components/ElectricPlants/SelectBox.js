import React, { Component } from 'react';
import loading from '../../loading.gif';

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

    
    return null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    const { type, set } = this.state;

    if (type === 'make' && set) {
      let newMakes = [];
      fetch('http://localhost:8081/allmakes')
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
              <div key={`${result.rows[i][0]}--make-div`}>
                <div
                  key={`make-id-${result.rows[i][0]}`}
                  value={result.rows[i][0]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][0]}
                </div>
                <div
                  key={`${result.rows[i][0]}--sep-make`}
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
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
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

    if (type === 'model') {
      console.log(set);
    }

    if (type === 'model' && set) {
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
        } else {
          this.setState({
            items: [],
            loading: true,
            attempted: false,
            option: 'Model of Vehicle',
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
          console.log('attempting fetch');
          fetch(`http://localhost:8081/years/${make}/${model}`)
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              console.log(result);
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
        } else {
          console.log('we here tho?');
          this.setState({
            items: [],
            loading: true,
            attempted: false,
            option: 'Year of Vehicle',
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
