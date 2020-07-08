import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

function OperatorInfo(props) {

    return(
        <div>
            <OperatorName>{props.opName}</OperatorName>
        </div>
    )
}

const OperatorName = styled.h2`
    color : white;
    font-weight : 200;
`;

export default OperatorInfo