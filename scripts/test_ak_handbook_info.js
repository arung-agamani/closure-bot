const { PrismaClient } = require('@prisma/client');

async function main(raw = true) {
  const prisma = new PrismaClient();
  let charInfo;
  try {
    if (raw) {
      charInfo = await prisma.ak_operator.findFirst({
        where: {
          name: 'Sora',
        },
        include: {
          ak_operator_handbook: {
            include: {
              ak_operator_handbook_story: true,
            },
          },
          ak_operator_charword: true,
        },
      });
    } else {
      charInfo = await prisma.ak_operator.findFirst({
        where: {
          name: 'Sora',
        },
        select: {
          name: true,
          tags: true,
          faction: true,
          profession: true,
          position: true,
          desc: true,
          ak_operator_handbook: {
            select: {
              infoName: true,
              drawName: true,
              ak_operator_handbook_story: {
                select: {
                  storyTitle: true,
                  storyText: true,
                },
              },
            },
          },
        },
      });
    }
    console.log(charInfo);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

main(false);
