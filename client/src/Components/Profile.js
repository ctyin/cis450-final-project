import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NavBar from './NavBar';
import ProfileTrip from './ProfileTrip';
import '../profile_page.css';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      redirect: false,
      trips: [],
    };
  }

  deleteItem = () => {
    const token = jwt_decode(localStorage.getItem('user-token'));

    const username = token.username;

    const newTrips = [];
    fetch(`http://localhost:8081/getTrips/${username}`)
      .then((res) => res.json())
      .then((result) => {
        result.forEach((trip, index) => {
          const tripElement = (
            <ProfileTrip
              position={index}
              key={trip._id}
              oid={trip._id}
              src={trip.sourceCity}
              dest={trip.destinationCity}
              distance={trip.distance}
              vehicle={trip.vehicle}
            />
          );

          newTrips.push(tripElement);
        });

        this.setState({ token: token, trips: newTrips, redirect: false });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    let loggedIn = localStorage.getItem('user-token');

    if (loggedIn !== null) {
      const token = jwt_decode(localStorage.getItem('user-token'));

      const username = token.username;

      const newTrips = [];
      fetch(`http://localhost:8081/getTrips/${username}`)
        .then((res) => res.json())
        .then((result) => {
          result.forEach((trip, index) => {
            const tripElement = (
              <ProfileTrip
                delete={this.deleteItem}
                position={index}
                key={trip._id}
                oid={trip._id}
                src={trip.sourceCity}
                dest={trip.destinationCity}
                distance={trip.distance}
                vehicle={trip.vehicle}
              />
            );

            newTrips.push(tripElement);
          });

          this.setState({ token: token, trips: newTrips, redirect: false });
        })
        .catch(err => {
          console.error(err)
        });
    } else {
      this.setState({ redirect: true });
    }
  }

  render() {
    const { token } = this.state;

    if (token !== null) {
      const firstname = token.firstname;
      const lastname = token.lastname;
    }

    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div id="wrapper">
        <NavBar />
        <div className="spacer" />

        {token !== null ? (
          <div className="container profile-container">
            <h2>
              Welcome, {token.firstname} {token.lastname}
            </h2>
            <hr />
            <h1>Trips:</h1>
            {this.state.trips}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Profile;
