'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const data = await prisma.todo.findMany({
			select: {
				id: true,
				title: true,
				isCompleted: true,
				price: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching todos:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
