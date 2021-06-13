/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const { data: charword } = await axios.get(
    'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/charword_table.json'
  );
  const maxCharwordLength = 0;
  const charwordKeys = Object.values(charword);
  const valueToInsert = [];
  charwordKeys.forEach((item) => {
    const value = {
      charWordId: item.charWordId,
      wordKey: item.wordKey,
      charId: item.charId,
      voiceId: item.voiceId,
      voiceText: item.voiceText,
      voiceTitle: item.voiceTitle,
      voiceIndex: item.voiceIndex,
      voiceType: item.voiceType,
      unlockType: item.unlockType,
      lockDescription: item.lockDescription,
      placeType: item.placeType,
      voiceAsset: item.voiceAsset,
    };
    valueToInsert.push(value);
  });
  const prismaRes = await prisma.ak_operator_charword.createMany({
    data: valueToInsert,
    skipDuplicates: true,
  });
  console.log(`Total value in json: ${valueToInsert.length}`);
  console.log(`Total value inserted: ${prismaRes.count}`);
}

main();
