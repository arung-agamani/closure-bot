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
    }

    render() {
        const TagClassRender = TagClass.map((text) => <Tag labelText={text} key={text} tagType="class"/>)
        const TagPosRender = TagPos.map((text) => <Tag labelText={text} key={text} tagType="pos"/>)
        const TagQualiRender = TagQuali.map((text) => <Tag labelText={text} key={text} tagType="quali"/>)
        const TagAffix1Render = TagAffix1.map((text) => <Tag labelText={text} key={text} tagType="affix"/>)
        const TagAffix2Render = TagAffix2.map((text) => <Tag labelText={text} key={text} tagType="affix"/>)
        return(
            <div className="container" 
            style={{
                height : '100vh',
                backgroundColor : 'white'
                }}>
                <div className="row">
                    <div className="col text-center">
                        <div className="container mt-3 text-dark">
                            <h5>Tags</h5>
                            <p>Pick max 3 tags</p>
                        </div>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col p-0">
                    <Tag labelText={TagQuali[0]} key={TagQuali[0]} tagType="quali"/>
                    </div>
                    <div className="col p-0">
                    <Tag labelText={TagQuali[1]} key={TagQuali[1]} tagType="quali"/>
                    </div>
                    <div className="col p-0">
                    <Tag labelText={TagQuali[2]} key={TagQuali[2]} tagType="quali"/>
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