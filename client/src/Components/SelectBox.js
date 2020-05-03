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
    };

    this.clickDropdown = this.clickDropdown.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    const { type, set } = this.state;

    if (type === 1 && set) {
      console.log('setting dropdown');
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
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
    }
    if (type === 2 && set) {
      console.log('setting dropdown');
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
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
      console.log('setting dropdown');
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
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
      console.log('setting dropdown');
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
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
    } else if (type === 5 && set) {
      console.log('setting dropdown');
      let newCities = [];
      fetch('http://localhost:8081/allcities')
        .then((res) => res.json())
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            newCities.push(
              <div key={`${result.rows[i][0]}--div`}>
                <div
                  key={`from-city-id-${result.rows[i][0]}`}
                  value={result.rows[i][1]}
                  onClick={this.selectItem}
                  className="items-box--item"
                >
                  {result.rows[i][1]}
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
