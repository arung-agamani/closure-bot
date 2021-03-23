import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

import CoconutMilkBg from '../coconut-milk.png';

const Wrapper = styled.div`
  height: 100vh;
  background-image: url('${CoconutMilkBg}') !important;
  background-position: top center;
  background-size: cover;
  margin: 0;
`;

const GlobalStyle = createGlobalStyle`
  body: {
    background-image: url('${CoconutMilkBg}') !important;
    overflow-x: hidden;
    overflow-y: hidden;
  }
`;

const GenshinTools = () => {
  const [isSigned, setIsSigned] = useState(false);
  const handleGetCookies = () => {
    const act_id = 'e202102251931481';
    axios
      .get('https://hk4e-api-os.mihoyo.com/event/sol/info', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'max-age=0',
        },
        params: {
          lang: 'en-us',
          act_id,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log('Request success:', res.data);
        if (!res.data.data.is_sign) {
          console.log('Not signed. Signing in...');
          axios
            .post(
              'https://hk4e-api-os.mihoyo.com/event/sol/sign',
              {
                act_id,
              },
              {
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Accept-Language': 'en-US,en;q=0.5',
                  'Cache-Control': 'max-age=0',
                },
                params: { lang: 'en-us' },
                withCredentials: true,
              }
            )
            .then((signRes) => {
              console.log('Sign up success! Daily rewards claimed.');
              setIsSigned(true);
              console.log('Request success:', signRes.data);
            })
            .catch((signErr) => {
              console.log('Request failed:', signErr);
            });
        } else {
          console.log('Youve signed today ^_^');
          setIsSigned(true);
        }
      })
      .catch((err) => {
        console.log('Error on request:', err);
      });
  };
  return (
    <Wrapper>
      <div className="container flex">
        <p className="h1">Genshin Tools</p>
        <div className="form-group">
          <p className="h3">Daily Sign-up</p>
          <p className="h5">
            Status:{' '}
            {isSigned
              ? 'Signed in. Daily reward claimed'
              : 'Not signed in, click the button below'}
          </p>
          {!isSigned && (
            <button className="btn btn-primary" onClick={handleGetCookies}>
              Check
            </button>
          )}
        </div>
        <div className="form-group">
          <p className="h3 pt-8">Code Redeem</p>
          <div className="input-group">
            <input
              className="form-control mb-2"
              type="text"
              placeholder="GENSHINGIFT42069"
            />
          </div>

          <button className="btn btn-primary">Redeem</button>
        </div>
      </div>
    </Wrapper>
  );
};

export default GenshinTools;
