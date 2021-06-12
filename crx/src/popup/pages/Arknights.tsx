/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';

import CharaList from '../components/Arknights/CharaList';

import WarfarinBG from '../static/images/bg-compressed.jpg';

const Arknights: React.FC = () => {
  return (
    <Wrapper className="flex flex-col p-8">
      <h1 className="text-2xl text-center">Arknights Data Explorer</h1>
      <p className="text-center">Source of Dimbreath&apos;s Repository</p>

      <p className="text-xl">Character Data</p>
      <CharaList />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* background-image: url(${WarfarinBG});
  background-position: center;
  background-size: cover; */

  section {
    max-height: 50vh;
    overflow-y: scroll;

    tr:hover {
      cursor: pointer;
      background-color: #d6d6d6;
    }
    table {
      font-size: 1rem;
    }
  }
`;

export default Arknights;
