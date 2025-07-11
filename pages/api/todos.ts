'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === 'GET') {
			const todos = await prisma.todo.findMany({
				select: {
					title: true,
					id: true,
					isCompleted: true,
					createdAt: true
				},
				orderBy: [
					{ isCompleted: 'asc' },
					{ createdAt: 'desc' },
				],
			});
			res.status(200).json(todos);
		} else if (req.method === 'POST') {
			const { title } = req.body;
			await prisma.todo.create({
				data: {
					title,
					createdAt: new Date(),
				},
			});
			res.status(201).end();
		} else {
			res.status(405).json({ error: 'Method not allowed' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}
