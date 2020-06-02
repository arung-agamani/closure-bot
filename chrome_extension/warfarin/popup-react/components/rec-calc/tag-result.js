import React, { Component } from 'react'
import charData from './char-data.js'

class TagResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flattenedData : charData.map(op => {
                let arr = [op.class,op.pos,...op.tags]
                if (op.quali !== null) {
                    arr.push(op.quali)
                }
                return {
                    opName : op.opName,
                    tags : arr
                }
            })
        } 
        console.log(this.state.flattenedData)
    }

    tagSubsets(tagArray) {
        return tagArray.reduce(
            (subsets, value) => subsets.concat(
                subsets.map(set => [value, ...set])
            ), [[]]
        );
    } 

    render() {
        let resultArray = []
        for (const tagSubset of this.tagSubsets(this.props.tagSelected)) {
            // console.log("================================")
            /* for (const tag of tagSubset) {
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
                
                // resultArray.push({tag : tag.text, result : filtered})
                // console.log(filtered)
            } */
            if (tagSubset.length > 0) {
                let filtered
                filtered = this.state.flattenedData.filter(item => tagSubset.every(tag => item.tags.includes(tag.text)))
                if (filtered.length > 0) {
                    resultArray.push({
                        tagString : tagSubset.map(x => x.text).join(", "),
                        result : filtered,
                        numOfTags : tagSubset.length
                    })
                    resultArray.sort((a,b) => {
                        return (a.numOfTags > b.numOfTags) ? -1 : (a.numOfTags == b.numOfTags) ? 0 : 1
                    })
                }
                
            }
            
        }
        
        // console.log(this.tagSubsets(this.props.tagSelected))
        return(
            <div className="container">
                <div className="row pt-3">
                    <div className="col text-light">
                        <h3 className="text-center">Selected tags</h3>
                        {resultArray.map(x => 
                        <div key={x.tagString}>
                            <h5>{x.tagString}</h5>
                            <p>{x.result.map(op => op.opName).join(", ")}</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default TagResult