import React, { Component } from 'react'

class ServerInfo extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let serverInfo = this.props.serverInfo;
        function useServer() {
            // simpan di storage
            chrome.storage.local.set({'currentUsedServer' : serverInfo}, function() {
                alert("Server info updated!");
            });
            // load ke context menu
            chrome.contextMenus.removeAll(() => {
                    chrome.contextMenus.create({
                    title : "Send to Discord",
                    contexts : ["image"],
                    id : "WARFARIN_001"
                    });
                    var tags = serverInfo.tags;
                    for (const tagObj of tags) {
                    chrome.contextMenus.create({
                        title : tagObj,
                        parentId : "WARFARIN_001",
                        contexts : ["image"],
                        documentUrlPatterns : ["https://*.twitter.com/*", "https://twitter.com/*"],
                        id : "WARFARIN_002_" + tagObj
                    });
                    chrome.contextMenus.create({
                        title : tagObj,
                        parentId : "WARFARIN_001",
                        contexts : ["image", "link"],
                        documentUrlPatterns : ["https://*.pixiv.net/*/artworks/*", "https://*.pixiv.net/*/"],
                        id : "WARFARIN_PIXIV_" + tagObj
                    });
                    }
                    console.log("Context menu updated!");            
                })        
            }
        document.getElementById('useThisServerButton').addEventListener('click', useServer);        
        document.getElementById('serverNameId').innerText = serverInfo.name;
        document.getElementById('serverLogoId').src = serverInfo.icon;
        document.getElementById('serverTagsId').innerText = serverInfo.tags.join(', ');
    }

    render() {
        return(
            <div className="row text-danger" id="serverInfoRow">
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