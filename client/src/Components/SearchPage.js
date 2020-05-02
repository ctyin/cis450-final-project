import React, { Component } from 'react';
import NavBar from './NavBar';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import '../search_page.css';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      src: null,
      dest: null,
      make: null,
      model: null,
      yr: null,
      miles: 0,
      emissions: 0,
      display: false,
    };
  }

  formSubmit = (src, dest, make, model, yr) => {
    // send query to backend
    this.setState({
      src: src,
      dest: dest,
      make: make,
      model: model,
      yr: yr,
      miles: 239.1,
      emissions: 84995.268,
      display: true,
    });
  };

  render() {
    const { src, dest, make, model, yr, miles, emissions } = this.state;

    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />
        <SearchForm func={this.formSubmit} />
        {this.state.display ? (
          <SearchResults
            src={src}
            dest={dest}
            make={make}
            model={model}
            yr={yr}
            miles={miles}
            emissions={emissions}
          />
        ) : (
          <h1 style={{ textAlign: 'center', marginTop: '150px' }}>
            Your result will be displayed here!
          </h1>
        )}
      </div>
    );
  }
}

export default SearchPage;
