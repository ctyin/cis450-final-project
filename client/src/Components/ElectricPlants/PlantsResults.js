import React, { Component } from 'react';
import Map from './myMap';

class PlantResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Fetched rows
      fetchedRows: [],
      toDisplay: [],


      src_coord: [],
      plant_coord: [],
      src_name: null,
      src_country: null,
      dest_name: null,
      dest_country: null,
      car_make: null,
      car_model: null,
      car_year: null,
      loading: true,
    };

    this.setDistance = this.setDistance.bind(this);
  }

  setDistance(val) {
    if (val !== this.state.distance) {
      this.setState({ distance: val });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { carId, ppId, ppYear, fueltype, primemover } = prevProps;

    if (
      carId !== this.props.carId ||
      ppId !== this.props.ppId ||
      ppYear !== this.props.ppYear ||
      fueltype !== this.props.fueltype ||
      primemover !== this.props.primemover
    ) {

      const newCarId = this.props.carId;
      const newPpId = this.props.ppId;
      const newPpYear = this.props.ppYear;
      const newFueltype = this.props.fueltype;
      const newPrimemover = this.primemover;

      const reqOptions1 = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: newCarId,
          plant_id: newPpId,
          year: newPpYear,
          prime_mover: newPrimemover,
          fueltype: newFueltype,
        }),
      };

      console.log(reqOptions1)

      let output = [];

      fetch('http://localhost:8081/epowerPairs', reqOptions1)
        .then(res => res.json())
        .then(result => {
          for (let i = 0; i < result.rows.length; i++) {
            let obj = {
              make: result.rows[i][0],
              model: result.rows[i][1],
              plantName: result.rows[i][2],
              plantState: result.rows[i][3],
            }
            output.push(obj);
          }

          console.log(output)

          this.setState({ fetchedRows: output, toDisplay: output[0], loading: false });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  componentDidMount() {
    // make fetch to backend for plant / ecar pair
    const { carId, ppId, ppYear, fueltype, primemover } = this.props;

    const reqOptions2 = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle_id: carId,
        plant_id: ppId,
        year: ppYear,
        prime_mover: primemover,
        fueltype: fueltype,
      }),
    };

    let output = [];

    fetch('http://localhost:8081/epowerPairs', reqOptions2)
      .then(res => res.json())
      .then(result => {
        for (let i = 0; i < result.rows.length; i++) {
          let obj = {
            make: result.rows[i][0],
            model: result.rows[i][1],
            plantName: result.rows[i][2],
            plantState: result.rows[i][3],
          }
          output.push(obj);
        }



        this.setState({ fetchedRows: output, loading: false });
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { loading } = this.state;
    const {
      fetchedRows
    } = this.state;

    // let fetchedRows = [{make: 'make1', model: 'model1'}, 
    // {make: 'make2', model: 'model2'},
    // {make: 'make3', model: 'model3'}]

    let displayVals = fetchedRows.map((value, index) => {
      return (
        <div>
        <div className="info-box--flex">
          <div className="info-box">
            {(index === 0) ? 
              (<h4>{value.make} {value.model}</h4>) :
              (<div>{value.make} {value.model}</div>)}
          </div>
          <div className="info-box">
          {(index === 0) ? 
              (<h4>{value.plantName}, {value.plantState}</h4>) :
              (<div>{value.plantName}, {value.plantState}</div>)}
          </div>
        </div>
        <div className="row-separator"></div>
        </div>
      )
    })


    return (
      <div style={{ marginTop: '60px' }}>
        {loading ? (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" />
          </svg>
        ) : (
            <div className="results-container">
              <Map
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjSdYZZCuf127nn-Hw8i-Hxji5xHUoLfQ&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div className="map-area" />}
                containerElement={<div className="map-area" />}
                mapElement={<div style={{ height: `100%` }} />}
                center={{ lat: 37.0902, lng: -95.7129 }}
                fetchPlaces={this.state.fetchedRows}
                zoom={14} 
              />


              <div className="info-area">
                <div className="info-box--flex">
                  <div className="title-box">
                    <h2>Top Cars/Plants</h2>
                  </div>
                </div>

                {displayVals}

              </div>
            </div>
          )}
      </div>
    );
  }
}

export default PlantResults;
