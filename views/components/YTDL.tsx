import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import socketIO from 'socket.io-client';

const SOCKET_SERVER = '/';

const YTDL: React.FC = () => {
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  useEffect(() => {
    const socket = socketIO(SOCKET_SERVER);
    setSocket(socket);
    socket.on('connect', () => {
      console.log('Connected to Socket.IO Server');
      outputRef.current.value += forgeOutputLine("Connected to Socket.IO server");
      logScroll();
    });
    socket.on('message', data => {
      outputRef.current.value += forgeInputLine(data);
      logScroll();
    })
    socket.on('metadata', data => {
      outputRef.current.value += forgeOutputLine(`Processing video with title: ${data.title}`);
      logScroll();
    })
    socket.on('download', data => {
      outputRef.current.value += forgeOutputLine(`Download progress: ${data}%`);
      logScroll();
    })
    socket.on('conversion', data => {
      outputRef.current.value += forgeOutputLine(`Conversion progress: ${data}%`);
      logScroll();
    })
    socket.on('done', data => {
      outputRef.current.value += forgeOutputLine(`Done conversion. \nNow serving '${data.filename}' on ${data.link} for 5 minutes`);
      setIsDone(true);
      setAudioUrl(data.link);
      logScroll();
    })
    socket.on('delete', data => {
      outputRef.current.value += forgeOutputLine(`${data} is expired.`)
    })
  }, []);

  const logScroll = () => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }

  const onButtonClick = () => {
    const url = inputRef.current.value;
    outputRef.current.value += forgeOutputLine(`Passing message to server: ${url}`);
    socket.emit('init url', url);
  }

  const onDownload = () => {
    window.open(audioUrl, '_blank')
  }

  const forgeOutputLine = (input: string): string => {
    return "> " + input + "\n";
  }

  const forgeInputLine = (input: string): string => {
    return "< " + input + "\n";
  }

  

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
        <div className="button" onClick={():void => onButtonClick()}>Get</div>
      </div>
      <div className="output-field">
        <textarea name="output-area" id="output-area" ref={outputRef} rows={10}></textarea>
      </div>
      {isDone && <div className="button" onClick={():void => onDownload()}>Download</div>}
    </Wrapper>
  );
};

export default YTDL;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

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
`;
