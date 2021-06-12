/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { AKCharData } from '../../interfaces/Arknights';
import { faction } from '../../utilities/AK';

const CharaDetail: React.FC<{ charData: AKCharData }> = ({ charData }) => {
  return (
    <Wrapper>
      <p>Name: {charData.name}</p>
      <p>Faction: {faction(charData.displayLogo)} </p>
      <p>Description: {charData.itemUsage}</p>
      <p>Rarity: {charData.rarity}*</p>
      <p>Tags: {charData.tagList.join(', ')}</p>
      <p>Image: {charData.phases[0].characterPrefabKey}</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default CharaDetail;
