import React, { Component } from 'react'
import styled from 'styled-components'
import _utils from './utils';

const SidebarContainer = styled.div`
    min-height : '100vh';
    min-width : '30vw';
    background-color : 'grey';
    position : 'fixed';
    left : 0;
    top : 0;
`;

class Sidebar extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    componentDidUpdate() {
        console.log(this.props.isToggle);
        let sidebarEl = document.querySelector(".sidebar-base").classList;
        if (this.props.isToggle) {            
            if (sidebarEl.contains("sidebar-hide")) {
                sidebarEl.remove("sidebar-hide");
                sidebarEl.add("sidebar-show");
            } else {
                sidebarEl.add("sidebar-show");
            }  
        } else {
            if (sidebarEl.contains("sidebar-show")) {
                sidebarEl.remove("sidebar-show");
                sidebarEl.add("sidebar-hide")
            }
        }
    }

    handleMenuClick(e) {
        this.props.handlePanelPick(e);
    }

    render() {
        return(
            <div className="sidebar-base">
                <div className="container">
                    <div className="row">
                        <div className="col" style={{color : 'white', minHeight : '100vh', alignItems : 'center', display : 'flex'}}>
                            <div id="sidebarItems" style={{display : 'inline', textAlign : 'center'}}>
                                <p onClick={() => this.handleMenuClick(_utils.PanelTypes.WARFARIN)}>Warfarin Settings</p>
                                <p onClick={() => this.handleMenuClick(_utils.PanelTypes.CLOSURE)}>Closure Settings</p>
                                <p onClick={() => this.handleMenuClick(_utils.PanelTypes.RECRUITMENTCALC)}>Recruitment Calculator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default Sidebar;