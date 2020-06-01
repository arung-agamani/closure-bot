import React, { Component } from 'react'
import TagSelector from './tag-selector'
import TagResult from './tag-result'

class RecruitmentCalculator extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="panel-base">
                <div className="container m-0 p-0" style={{maxWidth : '800px'}}>
                    <div className="row m-0 p-0" style={{width : '100vw'}}>
                        <div className="col-8" id="tagsResultDiv">
                            <TagResult>

                            </TagResult>
                        </div>
                        <div className="col-4 p-0" id="tagSelectorDiv">
                            <TagSelector>

                            </TagSelector>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecruitmentCalculator