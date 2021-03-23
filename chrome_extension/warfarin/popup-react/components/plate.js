import React, { Component } from 'react';

class Plate extends Component {
  render() {
    return (
      <div className="row">
        <div className="col pt-3 pb-3 m-2 mb-0 plate-base">
          <div className="media">
            <img
              src="medic_logo.png"
              alt=""
              className="align-self-center mr-3"
              style={{ width: '75px', height: '75px' }}
            />
            <div className="media-body align-self-center">
              <h3>Warfarin</h3>
              <a href="https://discord.com/api/oauth2/authorize?client_id=705449558024388648&permissions=52288&redirect_uri=https%3A%2F%2Faniharuka.herokuapp.com&response_type=code&scope=bot%20guilds">
                <p>Invite Closure to your Server</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Plate;
