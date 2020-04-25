import React, { Component } from 'react';

class SelectBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.elementID,
      label: this.props.label,
      option: this.props.option,
      loading: true,
      items: [
        { value: 'Huhhh', id: 'item-0' },
        { value: 'Whaaaa', id: 'item-1' },
        { value: 'Esseeee', id: 'item-2' },
        { value: 'Hehehe', id: 'item-3' },
        { value: 'flakdjf', id: 'item-4' },
      ],
      showItems: false,
    };

    this.clickDropdown = this.clickDropdown.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentDidMount() {
    //fetch for items
  }

  componentWillUnmount() {
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
        <input style={{ display: 'none' }} value={this.state.option}></input>
        <div className="search-label--label">{this.state.label}</div>
        <span className="search-option" id={this.state.id}>
          {this.state.option}
        </span>
        <div
          className={!this.state.showItems ? 'items-box hidden' : 'items-box'}
        >
          {this.state.items.map((item) => (
            <div>
              <div
                key={item.id}
                value={item.value}
                onClick={this.selectItem}
                className="items-box--item"
              >
                {item.value}
              </div>
              <div className="items-box--seperater"></div>
            </div>
          ))}
        </div>
      </label>
    );
  }
}

export default SelectBox;