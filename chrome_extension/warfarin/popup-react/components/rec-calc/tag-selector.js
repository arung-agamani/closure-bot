import React, { Component } from 'react'
import Tag from './tag'

const TagClass = [
    "Guard",
    "Medic",
    "Vanguard",
    "Caster",
    "Sniper",
    "Defender",
    "Supporter",
    "Specialist"
]
const TagPos = ["Melee", "Ranged"]
const TagQuali = ["Starter", "Senior Op", "Top Op"]
const TagAffix1 = [
    "Healing", "Support", "DPS", "AoE",
    "Slow", "Survival", "Defense", 
]

const TagAffix2 = [
    "Crowd Ctrl", "Nuker", "Summon", "Fast-RD",
    "DP-Recov.", "Robot", "Debuff", "Shift",
]

class TagSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTags : []
        }
        this.handleTagSelectEvent = this.handleTagSelectEvent.bind(this);
    }

    handleTagSelectEvent(tagText, tagType, callback) {
        let idx = -1
        for (let i = 0; i < this.state.selectedTags.length; i++) {
            if (this.state.selectedTags[i].text == tagText && this.state.selectedTags[i].type == tagType) {
                idx = i
                break
            }
        }
        if (idx !== -1) {
            this.state.selectedTags.splice(idx,1)
            callback(0)
        } else if (this.state.selectedTags.length < 5) {
            this.state.selectedTags.push({text : tagText, type : tagType})
            callback(1)
        }
        this.props.handleTagCombination(this.state.selectedTags)
    }

    render() {
        const TagClassRender = TagClass.map((text) => <Tag labelText={text} key={text} tagType="class" tagSelect={this.handleTagSelectEvent}/>)
        const TagPosRender = TagPos.map((text) => <Tag labelText={text} key={text} tagType="pos" tagSelect={this.handleTagSelectEvent}/>)
        const TagQualiRender = TagQuali.map((text) => <Tag labelText={text} key={text} tagType="quali" tagSelect={this.handleTagSelectEvent}/>)
        const TagAffix1Render = TagAffix1.map((text) => <Tag labelText={text} key={text} tagType="affix" tagSelect={this.handleTagSelectEvent}/>)
        const TagAffix2Render = TagAffix2.map((text) => <Tag labelText={text} key={text} tagType="affix" tagSelect={this.handleTagSelectEvent}/>)
        return(
            <div className="container tagSelector" 
            style={{
                height : '100vh',
                backgroundColor : 'white'
                }}>
                <div className="row">
                    <div className="col text-center">
                        <div className="container mt-3 text-dark">
                            <h5>Tags</h5>
                            <p>Max 5 tags</p>
                        </div>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col p-0">
                    <Tag labelText={TagQuali[0]} key={TagQuali[0]} tagType="quali" tagSelect={this.handleTagSelectEvent}/>
                    </div>
                    <div className="col p-0">
                    <Tag labelText={TagQuali[1]} key={TagQuali[1]} tagType="quali" tagSelect={this.handleTagSelectEvent}/>
                    </div>
                    <div className="col p-0">
                    <Tag labelText={TagQuali[2]} key={TagQuali[2]} tagType="quali" tagSelect={this.handleTagSelectEvent}/>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col p-0">
                        {TagClassRender}
                    </div>
                    <div className="col p-0">
                        {TagPosRender}
                        {TagAffix1Render}
                    </div>
                    <div className="col p-0">
                        {TagAffix2Render}
                    </div>
                </div>
            </div>
        ) 
    }
}

export default TagSelector