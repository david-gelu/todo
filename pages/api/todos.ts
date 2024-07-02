'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { notifyClients } from '@/server/websocket';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const todos = await prisma.todo.findMany({
			select: {
				title: true,
				id: true,
				isCompleted: true,
				price: true,
				createdAt: true
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
		res.json(todos);
	} else if (req.method === 'POST') {
		const { title, price } = req.body;
		await prisma.todo.create({
			data: { title, price },
		});
		await notifyClients()
		res.status(201).end()
	}
}
