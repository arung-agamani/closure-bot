import React, { Component } from 'react'

class SidebarButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkedFunction : this.props.sidebarButtonClicked
        }
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        this.state.linkedFunction();
    }
    render() {
        return(
            <button id="roundButton" onClick={this.handleButtonClick}/>
        )
    }
}

export default SidebarButton;