import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { switchPage, page } from '../reducers/pageReducer';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const pageState = useSelector(page);

  const changePage = (target) => {
    chrome.storage.local.set({ page: target });
    dispatch(switchPage(target));
  };

  return (
    <Wrapper>
      <Link
        to="/ak"
        className={`nav-item ${pageState.name === 'AK' ? 'nav-active' : ''}`}
      >
        <span onClick={() => changePage('AK')}>Arknights</span>
      </Link>
      <Link
        to="gi"
        className={`nav-item ${pageState.name === 'GI' ? 'nav-active' : ''}`}
      >
        <span onClick={() => changePage('GI')}>Genshin Impact</span>
      </Link>

      <Link
        to="al"
        className={`nav-item ${pageState.name === 'AL' ? 'nav-active' : ''}`}
      >
        <span onClick={() => changePage('AL')}>Azur Lane</span>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: gray;
  color: white;

  display: flex;
  flex-direction: row;

  .nav-active {
    background-color: white;
    color: black;
  }

  .nav-item {
    padding: 1rem;
  }

  .nav-item:hover {
    background-color: #6ac7d3;
    color: black;
    cursor: pointer;
  }
`;

export default Navbar;
