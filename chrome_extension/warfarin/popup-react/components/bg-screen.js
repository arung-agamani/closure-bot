import React, { Component } from 'react'
import Plate from './plate'
import ServerSelector from './server-selector'

class Background extends Component {
    render() {
        return(
            <>
            <Plate></Plate>
            <ServerSelector/>
            </>
        )
    }
}

export default Background