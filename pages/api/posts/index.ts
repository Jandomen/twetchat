import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { body } = req.body;

      const post = await prisma.post.create({
        data: {
          body,
          userId: currentUser.id
        }
      });

      return res.status(200).json(post);
    }

    if (req.method === 'GET') {
      const { userId, page, pageSize } = req.query;
      const currentPage = page ? Number(page) : 1;
      const itemsPerPage = pageSize ? Number(pageSize) : 10;

      let posts;

      if (userId && typeof userId === 'string') {
        posts = await prisma.post.findMany({
          where: {
            userId
          },
          include: {
            user: true,
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: (currentPage - 1) * itemsPerPage,
          take: itemsPerPage,
        });
      } else {
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: (currentPage - 1) * itemsPerPage,
          take: itemsPerPage,
        });
      }

      return res.status(200).json(posts);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
