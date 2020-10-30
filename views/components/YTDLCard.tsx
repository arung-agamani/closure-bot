import React from 'react';
import styled from 'styled-components';
import { VideoDetails } from 'ytdl-core';

export interface YTDLCardProps {
  // title: string;
  // thumbnailUrl : string;
  // videoInfo: VideoDetails;
  videoThumbnail: string;
  videoTitle: string;
  videoId: string;
  downloadLink: string;
}

const YTDLCard: React.FC<YTDLCardProps> = (props) => {
  const { downloadLink, videoThumbnail, videoTitle, videoId } = props;
  // console.log(videoInfo);
  return (
    <Wrapper>
      <h1>
        Download for
        <a href={`https://www.youtube.com/watch?v=${videoId}`}> {videoTitle}</a>
      </h1>
      <img src={videoThumbnail} alt="thumbnailUrl" />
      <div
        className="dl-button"
        onClick={() => window.open(downloadLink, '_blank')}
      >
        DOWNLOAD
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  border: 1px solid grey;
  box-shadow: 0px 0px 20px 2px grey;

  img {
    height: auto;
    width: 100%;
    max-width: 300px;
  }

  .dl-button {
    margin-top: 10px;
    padding: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    font-size: 2rem;
    width: 100%;
    background-color: #f1ede5;
    color: black;
  }
  .dl-button:hover {
    cursor: pointer;
  }
`;

export default YTDLCard;
