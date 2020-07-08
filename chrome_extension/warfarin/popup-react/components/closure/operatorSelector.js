import React, { useState, useEffect } from 'react'
import AutoSuggest from 'react-autosuggest'
import styled from 'styled-components'
import { render } from 'react-dom'

import CharData from '../rec-calc/char-data';



const getSuggestion = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = value.length;
    console.log("Input: " + inputValue);
    const res = inputLength === 0 ? [] : CharData.filter(op => {
        return op.opName.toLowerCase().includes(inputValue)
    });
    console.log(res);
    return res.slice(0,5);
}

const getSuggestionValue = suggestion => suggestion.opName

const renderSuggestion = suggestion => {
    return(
            <span style={{color : 'black'}}>
                {suggestion.opName}
            </span>
        
    )
};

const renderSuggestionsContainer = ({containerProps, children, query}) => {
    return(
        <div {...containerProps}>
            {children}
            <div>
                Press Enter to search <strong>operator</strong>
            </div>
        </div>
    )
}

const OperatorSuggestion = (props) => {
    const [value, setValue] = useState('');
    const [suggestion, setSuggestion] = useState([]);

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    }
    const onSuggestionsFetchRequested = ({value}) => {
        setSuggestion(getSuggestion(value))
    }
    const onSuggestionsClearRequested = () => {
        setSuggestion([])
    }
    const inputProps = {
        placeholder: 'Input Operator Name',
        value,
        onChange
    }
    return(
        <div className="container" style={{maxWidth: '280px'}}>
            <AutoSuggest
            suggestions={suggestion}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSuggestionsContainer={renderSuggestionsContainer}
            inputProps={inputProps}
            />
        </div>
        
    )
}

function OperatorSelector(props) {
    // const [operatorName, setOperatorName] = useState("")

    /* useEffect(() => {
        let inputValue = document.getElementById("operatorNameInput").value
        if (inputValue.length > 10) {
            setOperatorName("Length exceed! Maximum 10 char")
        }
    }) */
    return(
        <Wrapper className="container">
            <OperatorSuggestion></OperatorSuggestion> 
        </Wrapper>
           
        
        
        
    )
}

const Wrapper = styled.div`
    .react-autosuggest__container {
    display:block;
    justify-items:center;
    }

    .react-autosuggest__input {
    width: 280px;
    height: 30px;
    padding: 10px 20px;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border: 1px solid #aaa;
    border-radius: 4px;
    }

    .react-autosuggest__input--focused {
    outline: none;
    }

    .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    }

    .react-autosuggest__suggestions-container {
    display: none;
    }

    .react-autosuggest__suggestions-container--open {
    display: block;
    width: 280px;
    border: 1px solid #aaa;
    background-color: #fff;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    max-height: 100px;
    overflow-y: auto;
    z-index: 2;
    }

    .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
    }

    .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 10px 20px;
    }

    .react-autosuggest__suggestion--highlighted {
    background-color: #ddd;
    }
`;

export default OperatorSelector