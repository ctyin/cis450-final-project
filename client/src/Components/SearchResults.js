import React from 'react';

function SearchResults(props) {
  const { src, dest, make, model, yr, miles, emissions } = props;

  return (
    <div id="container">
      <h4>Source City: {src}</h4>
      <h4>Destination City: {dest}</h4>
      <h4>
        Vehicle Info: {yr} {make} {model}
      </h4>
      <h4>Total Miles: {miles} </h4>
      <h4>Total Emissions: {emissions} g </h4>
    </div>
  );
}

export default SearchResults;
