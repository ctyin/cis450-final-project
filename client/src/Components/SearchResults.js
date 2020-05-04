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
      distance: 0,
    };

    this.setDistance = this.setDistance.bind(this);
  }

  setDistance(val) {
    if (val !== this.state.distance) {
      this.setState({ distance: val });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { dest, src, vehicle } = prevProps;

    if (
      dest !== this.props.dest ||
      src !== this.props.src ||
      vehicle !== this.props.vehicle
    ) {
      const newSrc = this.props.src;
      const newDest = this.props.dest;
      const newCar = this.props.vehicle;

      fetch(`http://localhost:8081/twocities/${newSrc}/${newDest}`)
        .then((res) => res.json())
        .then((result) => {
          let source = [result.rows[1][2], result.rows[1][3]];
          let destination = [result.rows[0][2], result.rows[0][3]];
          let source_name = result.rows[1][1];
          let source_country = result.rows[1][4];
          let dest_name = result.rows[0][1];
          let dest_country = result.rows[0][4];
          fetch(`http://localhost:8081/vehicle/${newCar}`)
            .then((vres) => vres.json())
            .then((car) => {
              let make = car.rows[0][1];
              let model = car.rows[0][2];
              let year = car.rows[0][3];
              fetch(`http://localhost:8081/epascore/${car.rows[0][0]}`)
                .then((prescore) => prescore.json())
                .then((score) => {
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
  }

  componentDidMount() {
    // make fetch to backend
    const { src, dest, vehicle } = this.props;

    fetch(`http://localhost:8081/twocities/${src}/${dest}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        let source = [result.rows[1][2], result.rows[1][3]];
        let destination = [result.rows[0][2], result.rows[0][3]];
        let source_name = result.rows[1][1];
        let source_country = result.rows[1][4];
        let dest_name = result.rows[0][1];
        let dest_country = result.rows[0][4];
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

    const distanceSetter = this.setDistance;

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
              unitSystem: google.maps.UnitSystem.IMPERIAL,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                const distance = result.routes[0].legs[0].distance.value / 1609;
                distanceSetter(Math.round(distance));
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
            <div className="info-area">
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
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SearchResults;
