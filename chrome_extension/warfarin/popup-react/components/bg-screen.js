import React, { Component } from 'react'
import Plate from './plate'
import ServerSelector from './server-selector'
import ServerInfo from './server-info'

class Background extends Component {
    render() {
        return(
            <>
            <Plate></Plate>
            <ServerSelector/>
            <ServerInfo></ServerInfo>
            </>
        )
    }
}

export default Background