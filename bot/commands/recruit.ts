/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, MessageEmbed } from 'discord.js';
import * as ClosureType from '../closure';
import prisma from '../../db/prisma';
import logger from '../../utils/winston';
import { ak_operator } from '.prisma/client';

export const name = 'recruit';
export const description = 'Registering the channel';

function transformTags(tags: string[]) {
  const out = [];
  let isTop = false;
  let isSenior = false;
  tags.forEach((tag) => {
    const regex = new RegExp(tag, 'i');
    if ('DPS'.match(regex)) {
      out.push('DPS');
    } else if ('Starter'.match(regex)) {
      out.push('Starter');
    } else if ('Nuker'.match(regex)) {
      out.push('Nuker');
    } else if ('Survival'.match(regex)) {
      out.push('Survival');
    } else if ('Support'.match(regex)) {
      out.push('Support');
    } else if ('Healing'.match(regex)) {
      out.push('Healing');
    } else if ('DP-Recovery'.match(regex)) {
      out.push('DP-Recovery ');
    } else if ('Crowd-Control'.match(regex)) {
      out.push('Crowd-Control');
    } else if ('Defense'.match(regex)) {
      out.push('Defense');
    } else if ('AoE'.match(regex)) {
      out.push('AoE');
    } else if ('Slow'.match(regex)) {
      out.push('Slow');
    } else if ('Debuff'.match(regex)) {
      out.push('Debuff');
    } else if ('Fast-Redeploy'.match(regex)) {
      out.push('Fast-Redeploy');
    } else if ('Shift'.match(regex)) {
      out.push('Shift');
    } else if ('Summon'.match(regex)) {
      out.push('Summon');
    } else if ('Top-Operator'.match(regex)) {
      isTop = true;
    } else if ('Senior-Operator'.match(regex)) {
      isSenior = true;
    }
  });
  return {
    out,
    isTop,
    isSenior,
  };
}

export async function execute(
  message: Message,
  args: Array<string>,
  botObject: ClosureType.default
): Promise<void> {
  try {
    const { out: tagArgs, isTop, isSenior } = transformTags(args);
    let recruits: ak_operator[];
    if (tagArgs.length === 0) {
      recruits = await prisma.ak_operator.findMany({
        where: {
          in_recruit: true,
        },
      });
    } else {
      recruits = await prisma.ak_operator.findMany({
        where: {
          in_recruit: true,
          tags: {
            hasSome: tagArgs,
          },
        },
      });
    }

    const output = tagArgs.join(', ');
    const embed = new MessageEmbed();
    embed.setTitle(`Closure's Recruitment Assistant`);
    embed.setDescription(`Recruits for the given query : ${output}`);
    if (isTop) {
      const star6 = recruits.filter((x) => x.rarity === 5).map((x) => x.name);
      if (star6.length > 0) embed.addField('6*', star6.join(', '));
    }
    if (isSenior) {
      const star5 = recruits.filter((x) => x.rarity === 4).map((x) => x.name);
      if (star5.length > 0) embed.addField('5*', star5.join(', '));
    }
    if (tagArgs.length > 0) {
      const star4 = recruits.filter((x) => x.rarity === 3).map((x) => x.name);
      const star3 = recruits.filter((x) => x.rarity === 2).map((x) => x.name);
      const star2 = recruits.filter((x) => x.rarity === 1).map((x) => x.name);
      const star1 = recruits.filter((x) => x.rarity === 0).map((x) => x.name);
      if (star4.length > 0) embed.addField('4*', star4.join(', '));
      if (star3.length > 0) embed.addField('3*', star3.join(', '));
      if (star2.length > 0) embed.addField('2*', star2.join(', '));
      if (star1.length > 0) embed.addField('1*', star1.join(', '));
    }
    message.channel.send(embed);
  } catch (err) {
    message.channel.send('Error occured when processing that command');
    console.error(err);
  }
}
