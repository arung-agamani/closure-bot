/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client');

/**
 * Script to insert values about operators handbook.
 * NOTE : This excludes NPCs: npc_2005_wywu, npc_2006_fmzuki, npc_003_kalts, npc_010_chen, npc_001_doctor
 */

async function main() {
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/handbook_info_table.json'
    );
    const prisma = new PrismaClient();
    // const data = JSON.parse(
    //   fs.readFileSync(path.resolve(__dirname, 'handbook.json'), 'utf-8')
    // );
    const {
      handbookDict,
      handbookDisplayConditionList,
      npcDict,
      teamMissionList,
    } = data;
    const handbookDictValues = Object.values(handbookDict);
    const dbCharIds = await prisma.ak_operator.findMany({
      select: {
        char_id: true,
      },
    });
    const dbCharArr = dbCharIds.map((x) => x.char_id);
    console.log(`Total values on handbookDict: ${handbookDictValues.length}`);
    const values = [];
    handbookDictValues.forEach((val) => {
      const value = {
        charId: val.charID,
        infoName: val.infoName,
        drawName: val.drawName,
      };
      if (dbCharArr.includes(val.charID)) {
        values.push(value);
      }
    });
    const res = await prisma.ak_operator_handbook.createMany({
      data: values,
      skipDuplicates: true,
    });
    console.log(`Prisma inserted : ${res.count}`);
    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}

async function story() {
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/handbook_info_table.json'
    );
    const prisma = new PrismaClient();
    // const data = JSON.parse(
    //   fs.readFileSync(path.resolve(__dirname, 'handbook.json'), 'utf-8')
    // );
    const {
      handbookDict,
      handbookDisplayConditionList,
      npcDict,
      teamMissionList,
    } = data;
    const handbookDictValues = Object.values(handbookDict);
    const dbCharIds = await prisma.ak_operator.findMany({
      select: {
        char_id: true,
      },
    });
    const dbCharArr = dbCharIds.map((x) => x.char_id);
    console.log(`Total values on handbookDict: ${handbookDictValues.length}`);
    const values = [];
    handbookDictValues.forEach((val) => {
      const charId = val.charID;
      const storyArray = val.storyTextAudio;
      storyArray.forEach((item) => {
        const value = {
          charId,
          storyTitle: item.storyTitle,
          storyText: item.stories[0].storyText,
          unLockType: item.stories[0].unLockType,
          unLockParam: item.stories[0].unLockParam,
          unLockString: item.stories[0].unLockString,
          unLockorNot: item.unLockorNot,
        };
        if (dbCharArr.includes(val.charID)) {
          values.push(value);
        }
      });
    });
    const res = await prisma.ak_operator_handbook_story.createMany({
      data: values,
      skipDuplicates: true,
    });
    console.log(`Prisma inserted : ${res.count}`);
    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}

async function compare() {
  try {
    const prisma = new PrismaClient();
    const data = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'handbook.json'), 'utf-8')
    );
    const {
      handbookDict,
      handbookDisplayConditionList,
      npcDict,
      teamMissionList,
    } = data;
    const handbookDictKeys = Object.keys(handbookDict);
    const dbCharIds = await prisma.ak_operator.findMany({
      select: {
        char_id: true,
      },
    });
    const dbCharArr = dbCharIds.map((x) => x.char_id);
    const missingKeys = handbookDictKeys.filter((x) => !dbCharArr.includes(x));
    console.log(`Missing keys: ${missingKeys.join(', ')}`);
  } catch (error) {
    console.log(error);
  }
}

function getFieldLength() {
  let len = 0;
  const data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'handbook.json'), 'utf-8')
  );
  const {
    handbookDict,
    handbookDisplayConditionList,
    npcDict,
    teamMissionList,
  } = data;
  const handbookDictValues = Object.values(handbookDict);
  let longestUnlockString = '';
  handbookDictValues.forEach((val) => {
    let localLen = 0;
    val.storyTextAudio.forEach((item) => {
      if (item.stories[0].unLockString.length > localLen) {
        localLen = item.stories[0].unLockString.length;
        longestUnlockString = item.stories[0].unLockString;
      }
    });
    if (localLen > len) {
      len = localLen;
    }
  });
  console.log(`Length : ${len} | ${longestUnlockString}`);
}

story();
