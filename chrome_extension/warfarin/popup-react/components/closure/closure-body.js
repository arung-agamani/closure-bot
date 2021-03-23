import React, { Component } from 'react';
import styled from 'styled-components';
import OperatorInfo from './operatorInfo';
import OperatorSelector from './operatorSelector';

import OperatorBackground from './op-bg.png';
import MedicLogo from './medic.png';
import Star5 from './star-5.png';
import WarfarinE2 from './warfarin-e2.png';

class Closure extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="panel-base container-fluid p-0">
        <div className="row min-vh-100">
          <div className="col">
            <div className="d-flex flex-column h-100">
              <div className="row">
                <div
                  className="col"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '12.5vh',
                    zIndex: 10,
                  }}
                >
                  <div className="container text-center text-light">
                    <OperatorInfo opName="PRTS"></OperatorInfo>
                    <OperatorSelector></OperatorSelector>
                  </div>
                </div>
              </div>
              <div className="row flex-grow-1">
                <div className="col">
                  <OperatorView>
                    <div className="chara-bg">
                      <img src={WarfarinE2} alt="" />
                    </div>
                    <div className="row h-100 align-items-end info-pane">
                      <div className="col info-pane__left">
                        <div className="star">
                          <img src={Star5} />
                        </div>
                        <span className="name--big">Warfarin</span>
                        <div className="classLogo">
                          <div className="row w-100">
                            <div className="col-4">
                              <img
                                src={MedicLogo}
                                alt=""
                                className="classLogo"
                              />
                            </div>
                            <div className="col-8 pl-0 classLogo--details d-flex flex-column">
                              <div className="class w-100">
                                <span>Medic</span>
                              </div>
                              <div className="perks d-flex flex-grow-1">
                                <span>Healing, Support</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col info-pane__middle"></div>
                      <div className="col info-pane__right"></div>
                    </div>
                  </OperatorView>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const OperatorView = styled.div`
  background-image: url('${OperatorBackground}');
  background-size: cover;
  background-position: center;
  height: 87.5vh;
  display: flex;

  .chara-bg {
    position: absolute;
    top: -15vh;
    left: -10vw;
    img {
      width: 100%;
      height: auto;
    }
  }

  .info-pane {
    &__left {
      margin-left: 1rem;
      margin-bottom: 1rem;
      .star {
        filter: invert();
      }
    }
    .name {
      &--big {
        font-family: 'Microsoft YaHei';
        font-size: 4.5rem;
        color: white;
        text-shadow: 2.5px 2.5px 0px rgba(0, 0, 0, 0.25),
          2.5px -2.5px 0px rgba(0, 0, 0, 0.25),
          -2.5px 2.5px 0px rgba(0, 0, 0, 0.25),
          -2.5px -2.5px 0px rgba(0, 0, 0, 0.25);
        line-height: 4.5rem;
        font-weight: bolder;
      }
    }
    .classLogo {
      img {
        width: 75px;
        height: 75px;
      }
      &--details {
        color: white;
        .class {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 5px;
          border: 2px #a0a0a0;
          text-align: center;
        }
        .perks {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 5px;
          border: 2px #a0a0a0;
          text-align: center;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
        }
      }
    }
  }
`;

export default Closure;
