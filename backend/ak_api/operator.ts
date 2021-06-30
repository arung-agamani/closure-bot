import { Router, Request, Response } from 'express';
import prisma from '../../db/prisma';
import logger from '../../utils/winston';

const operator = Router();

operator.get('/:charId/all', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const opData = await prisma.ak_operator.findUnique({
      where: {
        char_id: charId,
      },
      include: {
        skills: true,
        handbook: {
          include: {
            handbook_story: true,
          },
        },
      },
    });
    if (opData)
      res.status(200).json({
        status: 'success',
        data: opData,
      });
    else
      res.status(404).json({
        status: 'success',
        data: 'no data',
      });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'failed',
      data: 'something went wrong',
    });
  }
});

operator.get('/:charId/info', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const info = await prisma.ak_operator.findFirst({
      where: {
        char_id: charId,
      },
    });
    if (info) {
      res.status(200).json({
        status: 'success',
        data: info,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'something went wrong',
    });
  }
});

operator.get('/:charId/charword', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const info = await prisma.ak_operator_charword.findMany({
      where: {
        charId,
      },
    });
    if (info) {
      res.status(200).json({
        status: 'success',
        data: info,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'something went wrong',
    });
  }
});

operator.get('/:charId/handbook', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const handbook = await prisma.ak_operator_handbook.findFirst({
      where: {
        charId,
      },
      select: {
        charId: true,
        infoName: true,
        drawName: true,
        handbook_story: {
          select: {
            storyTitle: true,
            storyText: true,
          },
        },
      },
    });
    res.status(200).json({
      status: 'success',
      data: {
        charId,
        voiceActor: handbook.infoName,
        illustrator: handbook.drawName,
        stories: handbook.handbook_story,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'something went wrong',
    });
  }
});

operator.get('/:charId/skills', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const skills = await prisma.ak_operator.findFirst({
      where: {
        char_id: charId,
      },
      include: {
        skills: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'something went wrong',
    });
  }
});

export default operator;
