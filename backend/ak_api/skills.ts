import { Router, Request, Response } from 'express';
import prisma from '../../db/prisma';
import logger from '../../utils/winston';

const skill = Router();

skill.get('/:skillId/all', async (req: Request, res: Response) => {
  try {
    const { skillId } = req.params;
    const skillData = await prisma.ak_operator_skill.findUnique({
      where: {
        skillId,
      },
      include: {
        skill_levels: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: skillData,
    });
  } catch (error) {
    logger.error(error);
    console.log(error)
    res.status(500).json({
      status: 'failed',
      message: 'error happened',
    });
  }
});

export default skill;
