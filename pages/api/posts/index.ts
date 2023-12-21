import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

 if (req.method === 'GET') {
  const { userId, page, pageSize } = req.query;
  const currentPage = page ? Number(page) : 1;
  const itemsPerPage = pageSize ? Number(pageSize) : 10;

  let posts;

  try {
    if (userId && typeof userId === 'string') {
      posts = await prisma.post.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      });
    } else {
      posts = await prisma.post.findMany({
        select: {
          id: true,
          body: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
 }


}
