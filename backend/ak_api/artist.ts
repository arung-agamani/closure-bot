import { Router, Request, Response } from 'express';
import prisma from '../../db/prisma';
import logger from '../../utils/winston';

const artist = Router()

artist.get('/list', async (req: Request, res: Response) => {
    try {
        const artist = await prisma.ak_operator_handbook.findMany({
            select: {
                charId: true,
                drawName: true,
            }
        })
        const artistMap = new Map<string, string[]>();
        artist.forEach(el => {
            if (artistMap.has(el.drawName)) {
                if (!artistMap.get(el.drawName).includes(el.charId)) artistMap.get(el.drawName).push(el.charId);
            } else {
                artistMap.set(el.drawName, [el.charId])
            }
        });
        res.status(200).json({
            status: 'success',
            data: Object.fromEntries(artistMap)
        })
    } catch (error) {
        logger.error(JSON.stringify(error))
        res.status(500).json({
            status: 'failed',
            message: 'error occured'
        })    
    }
})

export default artist;