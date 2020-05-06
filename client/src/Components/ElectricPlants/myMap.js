/* global google */
import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  withScriptjs
} from "react-google-maps";
import { MAP } from "react-google-maps/lib/constants";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: []
    };
    this.mapMounted = this.mapMounted.bind(this);
    this.fetchPlaces = this.fetchPlaces.bind(this);
  }

  fetchPlaces(map, myPlaces) {
    
    const request = {
      query: myPlaces[0].plantName + ', ' + myPlaces[0].plantState,
      fields: ['name', 'geometry']
    };

    let service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const first = results[0];

        map.setCenter(new google.maps.LatLng(first.geometry.location.lat(), first.geometry.location.lng()))
        const places = [{
          position: first.geometry.location,
          id: 0
        }]

        this.setState({ places });
      } else {
        console.log("Failed to retrieve" + request);
      }
    });
  }

  mapMounted(element) {
    const mapObject = element.context[MAP];
    this.fetchPlaces(mapObject, this.props.fetchPlaces);
  }

  render() {
    return (
      <GoogleMap
        ref={this.mapMounted}
        defaultZoom={this.props.zoom}
        defaultCenter={{
          lat: this.props.center.lat,
          lng: this.props.center.lng
        }}
      >
        {this.state.places.map(place => {
          return <Marker key={'marker--' + place.id} position={place.position} />;
        })}
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(Map));
