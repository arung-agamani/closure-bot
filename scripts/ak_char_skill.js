/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

(async () => {
  try {
    // const charRaw = JSON.parse(
    //   fs.readFileSync(path.resolve(__dirname, 'char.json'))
    // );
    // const gachaRaw = JSON.parse(
    //   fs.readFileSync(path.resolve(__dirname, 'gacha.json'))
    // );
    const { data: charRaw } = await axios.get(
      'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/character_table.json'
    );
    const { data: gachaRaw } = await axios.get(
      'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/gacha_table.json'
    );
    const chars = Object.keys(charRaw);
    const charIds = chars;
    const skill_values = [];
    chars.forEach((char) => {
      const { skills } = charRaw[char];
      skills.forEach((skill) => {
        const value = {
          charId: char,
          skillId: skill.skillId,
          overridePrefabKey: skill.overridePrefabKey,
          overrideTokenKey: skill.overrideTokenKey,
          levelUpCostCond: JSON.stringify(skill.levelUpCostCond),
          unlockCond: JSON.stringify(skill.unlockCond),
        };
        if (value.skillId) skill_values.push(value);
        // if (!value.skillId) console.log(value);
      });
    });
    const inRecruitment = [];
    // const existingData = await prisma.ak_operator.findMany();
    // const existintDataCharId = existingData.map((x) => x.char_id);
    // eslint-disable-next-line prefer-destructuring
    const recruitDetail = gachaRaw.recruitDetail;
    const valueToInsert = [];
    charIds.forEach((charId) => {
      const charData = charRaw[charId];
      const regex = new RegExp(`/ ${charData.name} /`);
      const value = {
        name: charData.name,
        desc: charData.description,
        tags: charData.tagList ? charData.tagList : [],
        faction: charData.displayLogo,
        rarity: charData.rarity,
        profession: charData.profession,
        position: charData.position,
        char_id: charId,
        in_recruit: false,
      };
      if (recruitDetail.match(regex)) {
        inRecruitment.push(charData.name);
        value.in_recruit = true;
      }
      valueToInsert.push(value);
    });
    // console.log(recruitDetail);
    // console.log(`In Recruitments: ${inRecruitment.join(', ')}`);
    // console.log(valueToInsert);
    // console.log(`Longest profession ${longestCharId}`);
    await prisma.ak_operator.createMany({
      data: valueToInsert,
      skipDuplicates: true,
    });
    console.log('Data inserted successfully!');
    const skRes = await prisma.ak_operator_char_skill.createMany({
      data: skill_values,
      skipDuplicates: true,
    });
    console.log(
      `Total values inserted to skill_char junction table: ${skRes.count}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();

/**
 * Note to self.
 * Rework the character insertion script.
 * Make sure it caters the tokens, make the fields nullable.
 */
