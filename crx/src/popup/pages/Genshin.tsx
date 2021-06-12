/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../../../../utils/axios-crx';

import CoconutMilkBg from '../static/images/coconut-milk.png';

import { convertTimezone, isBetweenLogin } from '../utilities/GI';

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

const GenshinTools: React.FC = () => {
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
              chrome.storage.local.set({
                gi_daily_status: 'claimed',
                gi_daily_date: Date.now(),
                gi_uid: res.data.data.uid,
              });
            })
            .catch((signErr) => {
              console.log('Request failed:', signErr);
              chrome.storage.local.set({
                gi_daily_status: 'unclaimed',
                gi_daily_date: Date.now(),
                gi_uid: res.data.data.uid,
              });
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
    setIsRedeemed(0);
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
    chrome.storage.local.get(
      ['gi_daily_status', 'gi_daily_date', 'gi_uid'],
      async (res) => {
        if (res.gi_daily_status === 'claimed') {
          const date = convertTimezone(
            new Date(res.gi_daily_date),
            'Asia/Makassar'
          );
          const [isLogged, a, b] = isBetweenLogin(date);
          console.log(a.toString());
          console.log(b.toString());
          console.log(date.toString());
          if (!isLogged) {
            console.log('Not logged');
            setIsSigned(false);
          } else {
            console.log('Logged');
            setIsSigned(true);
          }
          setUserId(res.gi_uid);
        } else {
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
            .then((res2) => {
              if (res2.data.message === 'OK') {
                setUserId(res2.data.data.uid);
                chrome.storage.local.set({
                  gi_daily_status: 'claimed',
                  gi_daily_date: Date.now(),
                  gi_uid: res2.data.data.uid,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              setUserId('Error on getting userId');
            });
        }
      }
    );
  }, []);
  return (
    <Wrapper>
      <div className="container flex flex-col p-4 overlay text-lg">
        <p className="text-3xl">Genshin Tools</p>
        <p className="text-2xl">Account ID: {userId}</p>
        <div className=" my-4 p-4 bg-white bg-opacity-50 rounded-2xl border-2 border-blue-200">
          <p className="text-xl">Daily Sign-up</p>
          <p className="text-lg">
            Status:{' '}
            {isSigned
              ? 'Signed in. Daily reward claimed'
              : 'Not signed in, click the button below'}
          </p>
          {!isSigned && (
            <button
              className="text-white bg-blue-400 rounded-xl p-2 px-4"
              onClick={handleGetCookies}
            >
              Check
            </button>
          )}
        </div>
        <div className="my-4 p-4 bg-white bg-opacity-50 rounded-2xl border-2 border-blue-200">
          <p className="text-xl">Code Redeem</p>
          <div className="">
            <input
              className="border-2 border-gray-400 bg-white text-black px-4 py-2"
              type="text"
              placeholder="GENSHINGIFT42069"
              onChange={(e) => setCodeRedeem(e.target.value)}
            />
          </div>
          <p className="text-lg">
            Status:{' '}
            {isRedeemed === 1
              ? redeemStatusMessage
              : isRedeemed === -1
              ? `Failed: ${redeemStatusMessage}`
              : 'Not requested'}
          </p>
          <button
            className="text-white bg-blue-400 rounded-xl p-2 px-4"
            onClick={handleRedeemCode}
          >
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
