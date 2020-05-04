import React, { Component } from 'react';
import NavBar from '../NavBar';
import '../../search_page.css';
import SelectBox from '../SelectBox';

class StatsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {category: 'model', subcategory: null};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({category: event.target.value});    
  }

  handleSubmit(event) {
    // alert('Your favorite flavor is: ' + this.state.value);
    if (this.state.category == 'model') { 
        alert('triggering true'); 
    }
    event.preventDefault();
  }

// tried to make a second handler but doesnt compile rip
//   handleChange2(event) {
//     this.setState({subcategory: event.target.value});    
//   }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
        <label>
          Pick a category:
          <select value={this.state.category} onChange={this.handleChange}>
            <option value="model">Model</option>
            <option value="make">Make</option>
            <option value="year">Year</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
        <div class = "spacer"/>


{/* the second dropdown changes the value in the first one for some reason... */}
        <label>
          Pick a sub-category:
          <select value={this.state.subcategory} onChange={this.handleChange2}>
            <option value="model">Model</option>
            <option value="make">Make</option>
            <option value="year">Year</option>
          </select>
        </label>
        <input type="submit" value="Submit" />

      </form>
    );
  }
}

export default StatsForm;