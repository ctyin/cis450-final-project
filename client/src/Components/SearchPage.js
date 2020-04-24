import React, { Component } from 'react';
import NavBar from './NavBar';
import SearchForm from './SearchForm';
import '../search_page.css';

class SearchPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />
        <SearchForm />
      </div>
    );
  }
}

export default SearchPage;
