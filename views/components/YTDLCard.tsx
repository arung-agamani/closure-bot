import React from 'react'
import styled from 'styled-components';
import { VideoDetails } from 'ytdl-core';

export interface YTDLCardProps {
    // title: string;
    // thumbnailUrl : string;
    // videoInfo: VideoDetails;
    videoThumbnail: string;
    videoTitle: string;
    downloadLink: string;
}

const YTDLCard: React.FC<YTDLCardProps> = (props) => {
    const {downloadLink, videoThumbnail, videoTitle} = props;
    // console.log(videoInfo);
    return (
        <Wrapper>
            <h1>Download for {videoTitle}</h1>
            <img src={videoThumbnail} alt="thumbnailUrl"/>
            <div className="dl-button" onClick={() => window.open(downloadLink, '_blank')}>DOWNLOAD</div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    img {
        aspect-ratio: 16 / 9;
    }
`;

export default YTDLCard
