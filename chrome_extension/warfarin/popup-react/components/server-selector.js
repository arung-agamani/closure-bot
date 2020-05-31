import React, { Component } from 'react'

class ServerSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handleClick : this.props.getServerInfoButtonClick,
            retrievedInfo : {}
        }
        this.handleServerInfoClick = this.handleServerInfoClick.bind(this);
    }
    componentDidMount() {
        this.setState({handleClick : this.state.handleClick})
        chrome.storage.local.get('currentUsedServer', (serverInfo) => {
            if (serverInfo.currentUsedServer.guildId !== undefined && serverInfo.currentUsedServer.guildId.match(/^\d*$/)) {
                let pointedGuildId = serverInfo.currentUsedServer.guildId;
                document.getElementById('targetGuildId').value = pointedGuildId;
                
            } else {
                console.log("Server info not found in storage");
                console.log(serverInfo.currentUsedServer);
            }
        })
        
        document.getElementById('retrieveButton').addEventListener('click', this.handleServerInfoClick);
    }

    handleServerInfoClick() {
        var guild_id_string = document.getElementById('targetGuildId').value;
        axios.get('http://ec2-18-139-226-28.ap-southeast-1.compute.amazonaws.com:2000/warfarin/'+guild_id_string+'/info')
            .then(response => {
                if (response.status === 200) {
                    let serverInfo = response.data;
                    serverInfo.guildId = guild_id_string;
                    this.setState({retrievedInfo : serverInfo})
                    this.state.handleClick(this.state.retrievedInfo);
                }
            })
    }
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