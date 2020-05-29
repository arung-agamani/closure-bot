import React, { Component } from 'react'

class ServerInfo extends Component {
    render() {
        return(
            <div className="row d-none text-danger" id="serverInfoRow">
                <div className="col m-2 pt-3 pb-3" style={{backgroundColor : 'rgba(255, 255, 255, 0.822)'}}>
                    <h5>Server Info</h5>
                    <div className="media">
                        <img src="./medic_logo.png" alt="" id="serverLogoId" className="mr-3" style={{width : '50px', height: '50px'}}/>
                        <div className="media-body">
                            <h5 id="serverNameId">Warfarin</h5>
                            <p>Available tags : <span id="serverTagsId"></span></p>
                        </div>
                    </div>
                    <input type="button" name="useThisServerButton" id="useThisServerButton" value="Use This Server Info" className="btn btn-danger btn-sm float-right"/>
                </div>
            </div>
        )
    }
}

export default ServerInfo