/*global google*/
import React, { Component } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
  GoogleMap,
} from 'react-google-maps';
const { compose, withProps, lifecycle } = require('recompose');

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      src_coord: [],
      dest_coord: [],
      src_name: null,
      src_country: null,
      dest_name: null,
      dest_country: null,
      car_make: null,
      car_model: null,
      car_year: null,
      loading: true,
    };
  }

  componentDidMount() {
    // make fetch to backend
    const { src, dest, vehicle } = this.props;

    fetch(`http://localhost:8081/twocities/${src}/${dest}`)
      .then((res) => res.json())
      .then((result) => {
        let source = [result.rows[0][2], result.rows[0][3]];
        let destination = [result.rows[1][2], result.rows[1][3]];
        let source_name = result.rows[0][1];
        let source_country = result.rows[0][4];
        let dest_name = result.rows[1][1];
        let dest_country = result.rows[1][4];
        fetch(`http://localhost:8081/vehicle/${vehicle}`)
          .then((vres) => vres.json())
          .then((car) => {
            let make = car.rows[0][1];
            let model = car.rows[0][2];
            let year = car.rows[0][3];
            fetch(`http://localhost:8081/epascore/${car.rows[0][0]}`)
              .then((prescore) => prescore.json())
              .then((score) => {
                console.log(score);
                this.setState({
                  src_coord: source,
                  dest_coord: destination,
                  src_name: source_name,
                  src_country: source_country,
                  dest_name: dest_name,
                  dest_country: dest_country,
                  car_make: make,
                  car_model: model,
                  car_year: year,
                  loading: false,
                });
              });
          });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { loading } = this.state;
    const {
      src_coord,
      dest_coord,
      src_name,
      src_country,
      dest_name,
      dest_country,
      car_make,
      car_model,
      car_year,
    } = this.state;

    let distance = '';

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
          const DirectionsService = new google.maps.DirectionsService();

          DirectionsService.route(
            {
              origin: new google.maps.LatLng(src_coord[0], src_coord[1]),
              destination: new google.maps.LatLng(dest_coord[0], dest_coord[1]),
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                console.log(result);
                this.setState({
                  directions: result,
                });
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );
        },
      })
    )((props) => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}
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
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjSdYZZCuf127nn-Hw8i-Hxji5xHUoLfQ&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div className="map-area" />}
            />
            <div className="info-area" />
          </div>
        )}
      </div>
    );
  }
}

export default SearchResults;
