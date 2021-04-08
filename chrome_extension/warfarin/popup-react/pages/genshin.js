/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import CoconutMilkBg from '../coconut-milk.png';

const Wrapper = styled.div`
  height: 100vh;
  background-image: url('${CoconutMilkBg}') !important;
  background-position: top -100px center;
  background-size: cover;
  margin: 0;

  .overlay {
    background-color: #ffffffaa;
  }
`;

const GenshinTools = () => {
  const [isSigned, setIsSigned] = useState(false);
  const [codeRedeem, setCodeRedeem] = useState('');
  const [isRedeemed, setIsRedeemed] = useState(0);
  const [redeemStatusMessage, setRedeemStatusMessage] = useState('');
  const [userId, setUserId] = useState('Fetching...');
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

  const handleRedeemCode = () => {
    const code = codeRedeem;
    setIsRedeemed(false);
    axios
      .get(
        `https://hk4e-api-os.mihoyo.com/common/apicdkey/api/webExchangeCdkey?uid=${userId}&region=os_asia&lang=en&cdkey=${code}&game_biz=hk4e_global`,
        {
          withCredentials: true,
          headers: {
            Origin: 'https://genshin.mihoyo.com',
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setIsRedeemed(1);
          console.log(res.data);
          setRedeemStatusMessage(res.data.message);
        }
      })
      .catch((err) => {
        setIsRedeemed(-1);
        console.log(err);
      });
  };

  useEffect(() => {
    /* chrome.cookies.getAll(
      {
        domain: 'mihoyo.com',
        name: 'account_id',
      },
      (cookie) => {
        console.log(cookie);
        setUserId(cookie[0].value);
      }
    ); */
    axios
      .get(
        'https://hk4e-api-os.mihoyo.com/common/apicdkey/api/getRoleByAidAndRegion?lang=en&region=os_asia&game_biz=hk4e_global',
        {
          withCredentials: true,
          headers: {
            Origin: 'https://genshin.mihoyo.com',
            Referer: 'https://genshin.mihoyo.com/',
          },
        }
      )
      .then((res) => {
        if (res.data.message === 'OK') {
          setUserId(res.data.data.uid);
        }
      })
      .catch((err) => {
        console.log(err);
        setUserId('Error on getting userId');
      });
  }, []);
  return (
    <Wrapper>
      <div className="container flex p-4 overlay">
        <p className="h1">Genshin Tools</p>
        <p className="h2">Account ID: {userId}</p>
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
              onChange={(e) => setCodeRedeem(e.target.value)}
            />
          </div>
          <p className="h5">
            Status:{' '}
            {isRedeemed === 1
              ? redeemStatusMessage
              : isRedeemed === -1
              ? `Failed: ${redeemStatusMessage}`
              : 'Not requested'}
          </p>
          <button className="btn btn-primary" onClick={handleRedeemCode}>
            Redeem
          </button>
        </div>
        <div className="flex items-center justify-center">
          <p className="center">Genshin Tools v0.0.1 by ShirayukiHaruka</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default GenshinTools;
