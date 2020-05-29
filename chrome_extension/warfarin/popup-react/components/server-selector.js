import React, { Component } from 'react'

class ServerSelector extends Component {
    render() {
        return (
            <div className="row">
                <div className="col m-2 pt-3 pb-3 server-selector-base">
                    <label style={{color : 'rgb(145, 0, 0)'}}>Server Target</label>
                    <div className="input-group mb-3">
                        <input type="text" name="targetGuildId" id="targetGuildId" className="form-control" placeholder="Guild ID here" aria-placeholder="Guild ID here"/>
                        
                    </div>
                    <input type="button" name="retrieveButton" id="retrieveButton" value="Retrieve Server Info" className="btn btn-danger btn-sm float-right"/>

                </div>
            </div>
        )
    }
}

export default ServerSelector