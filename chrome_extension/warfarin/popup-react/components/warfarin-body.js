import React, { Component } from 'react'
import Plate from './plate'
import ServerSelector from './server-selector'
import ServerInfo from './server-info'
import Sidebar from './sidebar'
import styled, { keyframes } from 'styled-components'

const fadeInUpKeyframes = {
    from : {
        opacity : 0,
        transform : 'translate(0px, 50px)'
    },
    to : {
        opacity : 1,
        transform : 'none'
    }
}
const fadeInDownKeyframes = {
    from : {
        opacity : 0,
        transform : 'translate(0px, -50px)'
    },
    to : {
        opacity : 1,
        transform : 'none'
    }
}
const fadeInUpAnimation = keyframes`${fadeInUpKeyframes}`;
const fadeInDownAnimation = keyframes`${fadeInDownKeyframes}`;
const FadeInUp = styled.div`
    animation : 0.5s ${fadeInUpAnimation};
`;
const FadeInDown = styled.div`
    animation : 0.5s ${fadeInDownAnimation};
`;

class Background extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoLoaded : false,
            serverInfo : {}
        };
    }

    handleServerSelector(retrievedInfo) {
        this.setState({infoLoaded : true, info : retrievedInfo});
    }

    render() {
        return(
            <>
            
            <FadeInDown>
                <Plate/>
            </FadeInDown>
            
            <FadeInDown>
                <ServerSelector getServerInfoButtonClick={this.handleServerSelector.bind(this)}/>
            </FadeInDown>  
            {
                this.state.infoLoaded ? <FadeInUp>
                <ServerInfo serverInfo={this.state.info}></ServerInfo>
                </FadeInUp> : null
            }
            
            </>
        )
    }
}

export default Background