/*global google*/
import React, { Component, useRef } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
  GoogleMap,
} from 'react-google-maps';
const { compose, withProps, lifecycle, withHandlers } = require('recompose');

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

      const { newCarId, newPpId, newPpYear, newFueltype, newPrimemover } = this.props;

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

    const distanceSetter = this.setDistance;
    let refs;

    const Map = compose(
      withProps({
        googleMapURL:
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyAjSdYZZCuf127nn-Hw8i-Hxji5xHUoLfQ&v=3.exp&libraries=geometry,drawing,places',
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div className="map-area" />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withScriptjs,
      withGoogleMap,
      lifecycle({
        componentDidMount() {

          // THIS LINE DOESN'T WORK
          const PlacesService = new google.maps.places.PlacesService(this.refs.map);

          let request = {
            query: fetchedRows[0][2] + ', ' + fetchedRows[0][3],
            fields: ['name', 'geometry']
          }

          PlacesService.findPlaceFromQuery(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              console.log(results);
            }
          })
          
          // const DirectionsService = new google.maps.DirectionsService();

          // DirectionsService.route(
          //   {
          //     origin: new google.maps.LatLng(src_coord[0], src_coord[1]),
          //     destination: new google.maps.LatLng(dest_coord[0], dest_coord[1]),
          //     travelMode: google.maps.TravelMode.DRIVING,
          //     unitSystem: google.maps.UnitSystem.IMPERIAL,
          //   },
          //   (result, status) => {
          //     if (status === google.maps.DirectionsStatus.OK) {
          //       const distance = result.routes[0].legs[0].distance.value / 1609;
          //       distanceSetter(Math.round(distance));
          //       this.setState({
          //         directions: result,
          //       });
          //     } else {
          //       console.error(`error fetching directions ${result}`);
          //     }
          //   }
          // );
        },
      })
    )((props) => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(37.0902, -95.7129)}
      >
        {props.directions && (
          <DirectionsRenderer directions={props.directions} />
        )}
      </GoogleMap>
    ));

    return (
      <div style={{ marginTop: '60px' }}>
        {loading ? (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" />
          </svg>
        ) : (
            <div className="results-container">
              <Map
                ref='map'
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjSdYZZCuf127nn-Hw8i-Hxji5xHUoLfQ&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div className="map-area" />}
              />
              {/* <div className="info-area">
              <div className="info-box--flex">
                <div className="info-box">
                  <div className="info-box--label">Distance</div>
                  <h2>{this.state.distance} mi</h2>
                </div>
                <div className="info-box">
                  <div className="info-box--label">CO2</div>
                </div>
              </div>
              <div className="info-box--flex">
                <div className="info-box">
                  <div className="info-box--label">Origin City</div>
                  <h2>{src_name}</h2>
                </div>
                <div className="info-box">
                  <div className="info-box--label">origin country</div>
                  <h2>{src_country}</h2>
                </div>
              </div>
              <div className="info-box--flex">
                <div className="info-box">
                  <div className="info-box--label">destination city</div>
                  <h2>{dest_name}</h2>
                </div>
                <div className="info-box">
                  <div className="info-box--label">destination country</div>
                  <h2>{dest_country}</h2>
                </div>
              </div>
              <div className="info-box--flex">
                <div className="info-box">
                  <div className="info-box--label">make</div>
                  <h2>{car_make}</h2>
                </div>
                <div className="info-box">
                  <div className="info-box--label">model</div>
                  <h2>{car_model}</h2>
                </div>
                <div className="info-box">
                  <div className="info-box--label">year</div>
                  <h2>{car_year}</h2>
                </div>
              </div>
            </div> */}
            </div>
          )}
      </div>
    );
  }
}

export default PlantResults;
