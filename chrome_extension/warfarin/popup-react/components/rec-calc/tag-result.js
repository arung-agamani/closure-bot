import React, { Component } from 'react'
import charData from './char-data.js'

const OpRarityColor = [
    "#dbdbdb",
    "#a3ff85",
    "#8599ff",
    "#ff8a8a",
    "#d9d929",
    "#fa9111"
]

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
                    tags : arr,
                    star : op.star
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
            if (tagSubset.length > 0) {
                let filtered
                filtered = this.state.flattenedData.filter(item => tagSubset.every(tag => item.tags.includes(tag.text)))
                if (filtered.length > 0) {
                    resultArray.push({
                        tagString : tagSubset.map(x => x.text).join(", "),
                        result : filtered.sort((a,b) => {return (a.star > b.star) ? -1 : (a.star == b.star) ? 0 : 1}),
                        numOfTags : tagSubset.length
                    })
                    resultArray.sort((a,b) => {
                        return (a.numOfTags > b.numOfTags) ? -1 : (a.numOfTags == b.numOfTags) ? 0 : 1
                    })
                }
            }
        }
        return(
            <div className="container">
                <div className="row pt-3">
                    <div className="col text-light">
                        <h3 className="text-center">Selected tags</h3>
                        {resultArray.map(x => 
                        <div key={x.tagString}>
                            <h5>{x.tagString}</h5>
                            <p>{x.result.map(op => <>
                                <span style={{color : OpRarityColor[op.star - 1]}}>{op.opName}, </span>
                            </>)}
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default TagResult