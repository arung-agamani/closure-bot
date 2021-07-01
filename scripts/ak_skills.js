/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const skillJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'skills.json'))
);
const skills = Object.values(skillJson);

// METADATA RELATED HERE //
console.log(`Total skills: ${skills.length}`);
console.log(`Keys of a single skill`);
console.log(Object.keys(skills[0]));
let levelMax = 0;
let keyLength = 0;
skills.forEach((skill) => {
  if (skill.levels.length > levelMax) levelMax = skill.levels.length;
  if (skill.skillId.length > keyLength) keyLength = skill.skillId.length;
  if (skill.iconId) console.log(skill.iconId.length);
});
console.log(`Maximum length of skillId ${keyLength}`);
console.log(`Maximum length of levels array : ${levelMax}`);
console.log('Keys of a level');
console.log(Object.keys(skills[0].levels[0]));
let bbMax = 0;
skills.forEach((skill) => {
  let localMax = 0;
  //   let refToBbMax = [];
  skill.levels.forEach((level) => {
    if (level.blackboard.length > localMax) {
      localMax = level.blackboard.length;
      //   refToBbMax = level.blackboard;
    }

    if (level.spData.levelUpCost) console.log(level.spData.levelUpCost);
  });
  if (localMax > bbMax) {
    bbMax = localMax;
    // console.log(refToBbMax);
  }
});
console.log(`Max length of blackboard : ${bbMax}`);

// Insert and Update data i guess

const prisma = new PrismaClient();
const ak_operator_skill_values = [];
// const ak_operator_skill_level_values = [];
// const ak_operator_skill_level_blackboard_values = [];
skills.forEach((skill) => {
  const value = {
    skillId: skill.skillId,
    iconId: skill.iconId,
    hidden: skill.hidden,
    levels: skill.levels,
  };
  ak_operator_skill_values.push(value);
  /* skill.levels.forEach((level) => {
    const lvlVal = {
      name: level.name,
      rangeId: level.rangeId,
      description: level.description,
      skillType: level.skillType,
      spType: level.spData.spType,
      maxChargeTime: level.spData.maxChargeTime,
      spCost: level.spData.spCost,
      initSp: level.spData.initSp,
      increment: level.spData.increment,
      prefabId: level.prefabId,
      duration: level.duration,
      skillId: skill.skillId,
    };
    ak_operator_skill_level_values.push(lvlVal);
    level.blackboard.forEach((bb) => {
      const bbVal = {
        name: level.name,
        spCost: level.spData.spCost,
        initSp: level.spData.initSp,
        key: bb.key,
        value: bb.value,
      };
      ak_operator_skill_level_blackboard_values.push(bbVal);
    });
  }); */
});
(async () => {
  try {
    const skillRes = await prisma.ak_operator_skill.createMany({
      data: ak_operator_skill_values,
      skipDuplicates: true,
    });
    console.log(`Total values inserted to skill table: ${skillRes.count}`);
    /* const levelRes = await prisma.ak_operator_skill_level.createMany({
      data: ak_operator_skill_level_values,
      skipDuplicates: true,
    });
    console.log(`Total values inserted to level table: ${levelRes.count}`);
    const bbRes = await prisma.ak_operator_skill_level_blackboard.createMany({
      data: ak_operator_skill_level_blackboard_values,
      skipDuplicates: true,
    });
    console.log(
      `Total values inserted to level_blackboard table: ${bbRes.count}`
    ); */
  } catch (error) {
    console.error('Error occured', error);
  } finally {
    await prisma.$disconnect();
  }
})();

/** Notes on skill levels
 * The differentiator lies at the spCost and initSp inside spData.
 * There might be another differentiator, but cherry picking on the middle
 * and the beginning shows same pattern.
 */
