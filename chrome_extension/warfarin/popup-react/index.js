import React from 'react';
import ReactDOM from 'react-dom';
import Warfarin from './components/warfarin-body';
import Sidebar from './components/sidebar';
import SidebarButton from './components/sidebar-button';
import './global.css';

const PanelTypes = {
    "WARFARIN" : 1,
    "CLOSURE" : 2,
    "ARKBOOKS" : 3,
    "RECRUITMENTCALC" : 4
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarToggle : false,
            currentPanel : PanelTypes.WARFARIN
        };
        this.handleSidebarButtonClicked = this.handleSidebarButtonClicked.bind(this);
        this.handlePanelPick = this.handlePanelPick.bind(this);
    }

    handleSidebarButtonClicked() {
        this.setState({
            sidebarToggle : !this.state.sidebarToggle
        });
    }

    handlePanelPick(panelType) {
        this.setState({currentPanel : panelType});
    }

    componentDidMount() {
        $(document).ready(function(){
            $('body').on('click', 'a', function(){
                    chrome.tabs.create({url: $(this).attr('href')});
                    return false;
                });
            });
    }
    render() {
        return(
            <>
                <SidebarButton sidebarButtonClicked={this.handleSidebarButtonClicked}></SidebarButton>
                <Sidebar isToggle={this.state.sidebarToggle}/>
                { (this.state.currentPanel === PanelTypes.WARFARIN) ? <div className="container">
                    <Warfarin/>
                </div> : (this.state.currentPanel === PanelTypes.CLOSURE) ? <div></div> : null}
                
            </>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));