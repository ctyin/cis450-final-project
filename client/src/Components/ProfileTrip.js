import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NavBar from './NavBar';

class ProfileTrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      redirect: false,
      source_city: null,
      source_country: null,
      dest_city: null,
      dest_country: null,
      make: null,
      model: null,
      year: null,
      position: this.props.position,
    };
  }

  componentDidMount() {
    let loggedIn = localStorage.getItem('user-token');

    if (loggedIn !== null) {
      const token = jwt_decode(localStorage.getItem('user-token'));

      const { src, dest, vehicle } = this.props;

      fetch(`http://localhost:8081/twocities/${src}/${dest}`)
        .then((res) => res.json())
        .then((result) => {
          let i, j;
          if (src == result.rows[1][0]) {
            i = 1;
            j = 0;
          } else {
            i = 0;
            j = 1;
          }
          let source_name = result.rows[i][1];
          let source_country = result.rows[i][4];
          let dest_name = result.rows[j][1];
          let dest_country = result.rows[j][4];
          fetch(`http://localhost:8081/vehicle/${vehicle}`)
            .then((vres) => vres.json())
            .then((car) => {
              let make = car.rows[0][1];
              let model = car.rows[0][2];
              let year = car.rows[0][3];
              this.setState({
                token: token,
                redirect: false,
                source_city: source_name,
                source_country: source_country,
                dest_city: dest_name,
                dest_country: dest_country,
                make: make,
                model: model,
                year: year,
              });
            });
        })
        .catch((err) => console.log('error here', err));
    } else {
      this.setState({ redirect: true });
    }
  }

  deleteTrip = (e) => {
    const id = this.props.oid;
    const username = this.state.token.username;

    fetch(`http://localhost:8081/removeTrip/${id}/${username}`)
      .then((res) => res.json)
      .then((response) => {
        console.log(response);

        this.props.delete(this.props.position);
      });
  };

  render() {
    const { srcid, destid, car } = this.state;

    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="trip-container">
        <span className="span-middle">
          <em>From:</em>{' '}
          {this.state.source_city !== null
            ? `${this.state.source_city}, ${this.state.source_country}`
            : ''}
        </span>
        <span className="span-middle">
          <em>To:</em>{' '}
          {this.state.dest_city !== null
            ? `${this.state.dest_city}, ${this.state.dest_country}`
            : ''}{' '}
        </span>
        <span className="span-middle">
          <em>Car:</em>{' '}
          {this.state.make !== null
            ? `${this.state.year} ${this.state.make} ${this.state.model}`
            : ''}
        </span>
        <span className="span-middle">
          <em>Distance:</em> {this.props.distance} mi
        </span>
        <div className="span-middle delete--btn-wrap">
          <button onClick={this.deleteTrip} className="delete--btn">
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default ProfileTrip;
