import React, { Component } from 'react';
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  withScriptjs,
} from 'react-google-maps';

export class MapContainer extends Component {
  state = { directions: null };

  componentDidMount() {
    console.log(this.props);
    // const directionsService = new google.maps.DirectionsService();
    // const originLat = this.props.origin[0];
    // const originLng = this.props.origin[1];
    // const destLat = this.props.destination[0];
    // const destLng = this.props.destination[1];

    // const origin = { lat: originLat, lng: originLng };
    // const destination = { lat: destLat, lng: destLng };

    // directionsService.route(
    //   {
    //     origin,
    //     destination,
    //     travelMode: google.maps.TravelMode.DRIVING,
    //     waypoints: [
    //       { location: new google.maps.LatLng(originLat, originLng) },
    //       { location: new google.maps.LatLng(destLat, destLng) },
    //     ],
    //   },
    //   (result, status) => {
    //     if (status === google.maps.DirectionsStatus.OK) {
    //       console.log(result);
    //       this.setState({ directions: result });
    //     } else {
    //       console.error('error fetching directions');
    //     }
    //   }
    // );
  }

  render() {
    const Map = withGoogleMap((props) => (
      <GoogleMap defaultCenter={{ lat: 6.5244, lng: 3.3792 }} defaultZoom={10}>
        {
          // <DirectionsRenderer directions={this.state.directions} />
        }
      </GoogleMap>
    ));

    return (
      <Map
        containerElement={<div className="map-area" />}
        mapElement={<div style={{ height: '100%', width: '100%' }} />}
      />
    );
  }
}

export default MapContainer;
