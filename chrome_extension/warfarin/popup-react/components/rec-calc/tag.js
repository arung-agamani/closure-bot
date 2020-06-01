import React, { Component } from 'react'
import styled from 'styled-components'

const Label = styled.div`
    width : 75px;
    color : white;
    text-align : center;
    display : flex;
    align-items : center;
    justify-content : center;
    margin-bottom : 5px;
`;

class Tag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected : false
        }
        this.handleTagClicked = this.handleTagClicked.bind(this)
    }

    handleTagClicked() {
        this.setState({
            selected : !this.state.selected
        })
    }

    render() {
        let tagClass = "tagLabel tag-" + this.props.tagType
        let tagClickedClass = this.state.selected ? " tag-selected" : ""
        return(
            <Label 
            className={tagClass + tagClickedClass}
            onClick={this.handleTagClicked}
            >
                <p>{this.props.labelText}</p>
            </Label>
        );
    }
}

export default Tag