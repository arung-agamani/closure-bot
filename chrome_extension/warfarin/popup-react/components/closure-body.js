import React, { Component } from 'react'
import styled from 'styled-components'

class Closure extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="panel-base">
                <div className="container ">
                    <div className="row">
                        <div className="col" style={{
                            height: '100vh',
                            display : 'flex',
                            alignItems : 'center',
                            justifyContent : 'center'
                            }}>
                            <div className="container text-center">
                                <h5>Closure will be here...</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Closure