import React, { Component } from 'react'
import TagSelector from './tag-selector'
import TagResult from './tag-result'

class RecruitmentCalculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tags : []
        }
        this.handleTagCombination = this.handleTagCombination.bind(this)
    }

    handleTagCombination(tagArray) {
        this.setState({tags : tagArray})
    }

    render() {
        return(
            <div className="panel-base">
                <div className="container m-0 p-0" style={{maxWidth : '800px'}}>
                    <div className="row m-0 p-0" style={{width : '100vw'}}>
                        <div className="col-8 pl-5" id="tagsResultDiv">
                            <TagResult tagSelected={this.state.tags}>

                            </TagResult>
                        </div>
                        <div className="col-4 p-0" id="tagSelectorDiv">
                            <TagSelector handleTagCombination={this.handleTagCombination}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecruitmentCalculator