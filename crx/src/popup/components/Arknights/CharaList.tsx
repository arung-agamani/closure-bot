import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';

import { AKCharData } from '../../interfaces/Arknights';
import { faction } from '../../utilities/AK';
import CharaDetail from './CharaDetail';

interface CharData {
  [keys: string]: AKCharData;
}

const fuseOptions: Fuse.IFuseOptions<AKCharData> = {
  keys: ['tagList', 'profession', 'name'],
  findAllMatches: true,
};

const fuseInitialState: Fuse.FuseResult<AKCharData>[] = [];

const fuse = new Fuse<AKCharData>([], fuseOptions);

const CharaList = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [charDataReady, setCharDataReadyStatus] = useState(0);
  const [charData, setCharData] = useState<CharData>(null);
  const [charDataList, setCharDataList] = useState<
    Fuse.FuseResult<AKCharData>[]
  >(fuseInitialState);
  const [showCharList, setShowCharList] = useState(true);
  const [charDetailIdx, setCharDetailIdx] = useState(-1);

  const fetchCharacterTable = () => {
    setIsFetching(true);
    chrome.storage.local.get('ak_char_data', async (res) => {
      if (res.ak_char_data) {
        setCharData(res.ak_char_data);
        setCharDataReadyStatus(1);
        fuse.setCollection(Object.values(res.ak_char_data));
        setIsFetching(false);
      } else {
        try {
          const { data } = await axios.get(
            'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/character_table.json'
          );
          // save data
          chrome.storage.local.set({ ak_char_data: data }, () => {
            if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError.message);
            } else {
              console.log('AK : Fetching data done!');
              setCharData(data);
              setCharDataReadyStatus(1);
              fuse.setCollection(Object.values(data));
            }
            setIsFetching(false);
          });
        } catch (err) {
          console.error(err);
          console.log('AK : Fetching data failed :(');
          setIsFetching(false);
        }
      }
    });
  };

  const filterCharList = (searchString: string) => {
    if (searchString !== '') {
      const res = fuse.search(searchString);
      setCharDataList(res);
    } else {
      const res = Object.values(charData).map((val) => ({
        item: val,
        matches: [],
        score: 1,
        refIndex: 1,
      }));
      setCharDataList(res);
    }
  };

  const showCharDetailAction = (index: number) => {
    setCharDetailIdx(index);
    setShowCharList(false);
  };

  const showCharListAction = () => {
    setCharDetailIdx(-1);
    setShowCharList(true);
  };

  useEffect(() => {
    setIsFetching(true);
    chrome.storage.local.get('ak_char_data', async (res) => {
      if (res.ak_char_data) {
        setCharData(res.ak_char_data);
        setCharDataReadyStatus(1);
        fuse.setCollection(Object.values(res.ak_char_data));
        setIsFetching(false);
      } else {
        setCharDataReadyStatus(-1);
      }
    });
  }, []);

  if (charDataReady === 0) return <p>Loading...</p>;
  if (charDataReady === -1)
    return (
      <button
        onClick={fetchCharacterTable}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Character Table
      </button>
    );

  return (
    <>
      {!charData && !charDataReady && (
        <button
          onClick={fetchCharacterTable}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Character Table
        </button>
      )}

      <p className="text-lg">
        {charData && !isFetching && Object.keys(charData).length} Items
      </p>
      <label htmlFor="char_search">Search</label>
      <input
        type="text"
        name="char_search"
        id="char_search"
        className="p-2 border-blue-400 border-2"
        onChange={(e) => {
          filterCharList(e.target.value);
        }}
      />
      {charData && showCharList && Object.keys(charData).length > 0 && (
        <section>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rarity</th>
                <th>Class</th>
                <th>Faction</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {charDataList.map((char: Fuse.FuseResult<AKCharData>, index) => {
                return (
                  <tr
                    key={char.item.name}
                    onClick={() => showCharDetailAction(index)}
                  >
                    <td>{index + 1}</td>
                    <td>{char.item.name}</td>
                    <td>{char.item.rarity}</td>
                    <td>{char.item.profession}</td>
                    <td>{faction(char.item.displayLogo)}</td>
                    <td>
                      {char.item.tagList
                        ? char.item.tagList.join(', ')
                        : 'No tags'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {charData && !showCharList && (
        <>
          <h1 className="text-xl">Character Detail</h1>
          <button
            onClick={showCharListAction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
          <p>Showing Char Index {charDetailIdx + 1}</p>
          <CharaDetail charData={Object.values(charData)[charDetailIdx]} />
        </>
      )}
    </>
  );
};

export default CharaList;
