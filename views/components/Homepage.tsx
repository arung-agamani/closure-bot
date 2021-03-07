import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Homepage: React.FC = () => {
  return (
    <Wrapper>
      <div className="hero">
        <h1>
          [Insert Closure illustration here that drawn by me when it&apos;s
          finished, hm]
        </h1>
        <h2>
          For now, you can go to Youtube to MP3 downloader by clicking{' '}
          <Link to="/ytdl">here</Link>
        </h2>
      </div>
      <main className="content">
        <div className="navbar-content">
          <div className="nav-item">What is this?</div>
          <div className="nav-item">How do I use this?</div>
        </div>
        <section className="features">
          <div className="feature-item">
            <div className="feature-content">
              <h2>Music Player</h2>
              <p>
                Because it&apos;s like the starter kit for any Discord Bot.
                Closure can play some music. You can queue, skip, jump, and
                it&apos;s search first then confirm. Confirming has never been
                so easy with reactions.
              </p>
            </div>
            <div className="feature-content">
              <h2>Commands</h2>
              <ul>
                <li>
                  play [youtube url link] : Add youtube into current playlist
                  then play.
                </li>
                <li>
                  stop : Stop the current playlist. Also deletes the playlist.
                </li>
                <li>skip : Skip the current playing music.</li>
                <li>np : Shows now playing music with queue.</li>
                <li>
                  jump to [index]: Skip the current playing music and set the
                  now playing to the index according to queue
                </li>
              </ul>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-content">
              <h2>Youtube to MP3 Downloader</h2>
              <p>
                Yeah, it can convert youtube videos into download-ready mp3
                file. It&apos;s limited to 10 minutes video and not accepting
                live videos.
              </p>
            </div>
            <div className="feature-content">
              <h2>Commands</h2>
              <ul>
                <li>
                  ytdl [youtube url] : Put youtube link here, and if it meets
                  the criteria, there will be followup messages regarding your
                  download task. If it&apos;s success, download link will be
                  given and you can just click the link.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  height: 100vh;

  a {
    text-decoration: none;
    color: #2626b9;
  }

  .hero {
    display: flex;
    background-color: #11111d;
    color: #f8f8f8;
    flex-direction: column;
    margin: auto;
    align-items: center;
    justify-content: center;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    background-color: #e0d8c0;

    padding-bottom: 300px;

    .navbar-content {
      display: flex;
      flex-direction: row;
      background-color: #c9bd99;
      width: 100%;
      justify-content: space-evenly;
      box-shadow: 0px 3px 5px 1px #918870;

      .nav-item {
        padding: 10px;
      }

      .nav-item:hover {
        background-color: #706647;
      }
    }

    .features {
      margin-left: 10%;
      margin-right: 10%;
      display: flex;
      flex-direction: column;

      .feature-item {
        display: flex;
        margin-top: 75px;
        padding-right: 0.5rem;

        .feature-content {
          width: 50%;
          padding-right: 1rem;
        }
        .feature-image {
          width: 50%;
        }
      }
    }
    .features-item:nth-child(2n + 0) {
      flex-direction: row-reverse;
    }
  }
`;

export default Homepage;
