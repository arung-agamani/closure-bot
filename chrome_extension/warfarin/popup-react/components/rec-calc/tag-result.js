import React, { Component } from 'react'
import charData from './char-data.js'

class TagResult extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let resultArray = []
        for (const tag of this.props.tagSelected) {
            let filtered
            if (tag.type == "class") {
                filtered = charData.filter(item => item.class == tag.text).map(el => el.opName).join(", ")
            } else if (tag.type == "affix") {
                filtered = charData.filter(item => item.tags.includes(tag.text)).map(el => el.opName).join(", ")
            } else if (tag.type == "pos") {
                filtered = charData.filter(item => item.pos == tag.text).map(el => el.opName).join(", ")
            } else {
                filtered = charData.filter(item => item.quali == tag.text).map(el => el.opName).join(", ")
            }
            resultArray.push({tag : tag.text, result : filtered})
        }
        console.log(resultArray)
        return(
            <div className="container">
                <div className="row pt-3">
                    <div className="col">
                        <h3 className="text-center">Selected tags</h3>
                        {resultArray.map(x => 
                        <div key={x.tag}>
                            <h5>{x.tag}</h5>
                            <p>{x.result}</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default TagResult