import React, { Component } from 'react';
import SelectBox from './SelectBox';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false,
    };
  }

  render() {
    return (
      <div className="container">
        <form action="get" role="search">
          <div className="search-wrapper">
            <div className="search-inputs">
              <div className="search-input">
                <div className="select-form">
                  <SelectBox id='x'
                    label="Origin"
                    option="Origin City"
                    elementID="source"
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    label="destination"
                    option="Destination City"
                    elementID="dest"
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    label="Make"
                    option="Make of Vehicle"
                    elementID="make"
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    option="Model of Vehicle"
                    label="Model"
                    elementID="model"
                  />
                </div>
              </div>
              <div className="separater"></div>
              <div className="search-input">
                <div className="select-form">
                  <SelectBox
                    label="Year"
                    option="Year of Vehicle"
                    elementID="year"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchForm;
