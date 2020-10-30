import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Homepage = () => {
  return (
    <Wrapper>
      <h1>Closure Homepage will be here.</h1>
      <h2>
        For now, you can go to Youtube to MP3 downloader by clicking{' '}
        <Link to="/ytdl">here</Link>
      </h2>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
`;

export default Homepage;
