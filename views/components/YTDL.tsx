import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import socketIO from 'socket.io-client';
import { VideoDetails } from 'ytdl-core';

import Card, { YTDLCardProps } from './YTDLCard';

const SOCKET_SERVER = 'https://closure.howlingmoon.dev/';

interface DownloadedCardProps {
  downloadLink: string;
  metadata: YTDLCardProps;
  isValid: boolean;
}

const initialDownloadedCardProps: DownloadedCardProps = {
  downloadLink: '',
  metadata: null,
  isValid: false,
};

const YTDL: React.FC = () => {
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
  const [downloaded, setDownloaded] = useState<DownloadedCardProps[]>([
    initialDownloadedCardProps,
  ]);
  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const socket = socketIO(SOCKET_SERVER);
    setSocket(socket);
    socket.on('connect', () => {
      // console.log('Connected to Socket.IO Server');
      outputRef.current.value += forgeOutputLine('Connected to server');
      logScroll();
    });
    socket.on('message', (data) => {
      outputRef.current.value += forgeInputLine(data);
      logScroll();
    });
    socket.on('error', (data) => {
      outputRef.current.value += forgeOutputLine(
        `${data.message}, Type: ${data.type}, ID: ${data.id}`
      );
    });
    socket.on('metadata', (data) => {
      outputRef.current.value += forgeOutputLine(
        `Processing video with title: ${data.title}`
      );
      // console.log(data);
      logScroll();
    });
    socket.on('download', (data) => {
      outputRef.current.value += forgeOutputLine(
        `Download progress: ${(parseFloat(data.progress) * 100).toPrecision(
          2
        )}%`
      );
      logScroll();
    });
    socket.on('conversion', (data) => {
      outputRef.current.value += forgeOutputLine(
        `Conversion progress: ${(parseFloat(data.progress) * 100).toPrecision(
          2
        )}%`
      );
      logScroll();
    });
    socket.on('done', (data) => {
      // setIsDone(true);
      outputRef.current.value += forgeOutputLine(
        `Done conversion. \nNow serving '${data.filename}' on ${data.link} for 5 minutes`
      );
      // setAudioUrl(data.link);
      const videoInfo = data.metadata as VideoDetails;
      const metadata: YTDLCardProps = {
        downloadLink: data.link,
        videoThumbnail: videoInfo.thumbnail.thumbnails[0].url,
        videoTitle: videoInfo.title,
        videoId: videoInfo.videoId,
      };
      const arr = [...downloaded];
      arr.push({
        downloadLink: metadata.downloadLink,
        metadata,
        isValid: true,
      });
      // console.log(arr);
      setDownloaded(arr);
      logScroll();
    });
    socket.on('delete', (data) => {
      outputRef.current.value += forgeOutputLine(`${data} is expired.`);
    });
  }, []);
  const logScroll = () => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  };

  const onButtonClick = () => {
    const url = inputRef.current.value;
    outputRef.current.value += forgeOutputLine(
      `Passing message to server: ${url}`
    );
    socket.emit('init url', url);
  };

  const forgeOutputLine = (input: string): string => {
    return `> ${input}\n`;
  };

  const forgeInputLine = (input: string): string => {
    return `< ${input}\n`;
  };

  return (
    <Wrapper>
      <h1>Closure&apos;s Youtube to MP3 Downloader</h1>
      <div className="input-link">
        <input
          type="text"
          name="yt-link"
          id="yt-link"
          className="input-field"
          ref={inputRef}
        />
        <div className="button" onClick={(): void => onButtonClick()}>
          Get
        </div>
      </div>
      <div className="output-field">
        <textarea
          name="output-area"
          id="output-area"
          ref={outputRef}
          rows={10}
          readOnly
          style={{ resize: 'none' }}
        ></textarea>
      </div>
      {/* {isDone && (
        <div className="button" onClick={(): void => onDownload()}>
          Download
        </div>
      )} */}
      <div className="card-container">
        {downloaded &&
          downloaded.map((item) => {
            if (item.isValid) {
              return (
                <Card
                  downloadLink={item.downloadLink}
                  videoThumbnail={item.metadata.videoThumbnail}
                  videoTitle={item.metadata.videoTitle}
                  videoId={item.metadata.videoId}
                  key={item.downloadLink}
                />
              );
            }
            return null;
          })}
      </div>
    </Wrapper>
  );
};

export default YTDL;

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  text-align: center;
  font-family: 'Roboto', sans-serif;

  .input-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;

    .input-field {
      line-height: 120%;
      padding: 5px;
      padding-right: -5px;
      font-size: 1.5rem;
      flex-grow: 1;
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      color: white;
      background-color: grey;
    }
    .button:hover {
      cursor: pointer;
    }
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    color: white;
    background-color: #0b223d;
  }

  .output-field {
    display: flex;
    flex-direction: column;
    width: 100%;
    .output-area {
      width: 100%;
    }
  }

  .card-container {
    margin-top: 20px;
  }
`;
