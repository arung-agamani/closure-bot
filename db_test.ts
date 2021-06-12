import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { AKCharData } from './crx/src/popup/interfaces/Arknights';

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/character_table.json'
    );
    const { data: gachaData } = await axios.get(
      'https://raw.githubusercontent.com/Dimbreath/ArknightsData/master/en-US/gamedata/excel/gacha_table.json'
    );
    const charIds = Object.keys(data);
    const inRecruitment = [];
    const recruitDetail = gachaData.recruitDetail as string;
    const valueToInsert = [];
    charIds.forEach((charId) => {
      const charData: AKCharData = data[charId];
      const regex = new RegExp(`/ ${charData.name} /`);
      if (
        !charData.name ||
        !charData.description ||
        !charData.tagList ||
        !charData.displayLogo ||
        !charData.profession ||
        !charData.position
      ) {
        console.log(`${charId} not inserted because not an operator`);
      } else {
        const value = {
          name: charData.name,
          desc: charData.description,
          tags: charData.tagList,
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
      }
    });
    console.log(recruitDetail);
    console.log(`In Recruitments: ${inRecruitment.join(', ')}`);
    await prisma.ak_operator.createMany({
      data: valueToInsert,
      skipDuplicates: true,
    });
    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error on fetching data');
    console.log(error);
  }
}

main();
