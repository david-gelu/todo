import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const page = Math.max(1, Number(req.query.page) || 1);
			const limit = Math.max(1, Number(req.query.limit) || 40);
			const search = (req.query.search as string) || '';
			const skip = (page - 1) * limit;

			const totalItems = await prisma.todo.count({
				where: {
					title: {
						contains: search,
						mode: 'insensitive',
					},
				},
			});

			const todos = await prisma.todo.findMany({
				where: {
					title: {
						contains: search,
						mode: 'insensitive',
					},
				},
				take: limit,
				skip: skip,
				orderBy: {
					createdAt: 'desc',
				},
			});

			const totalPages = Math.max(1, Math.ceil(totalItems / limit));

			return res.json({
				todos,
				totalPages,
				currentPage: page,
				totalItems,
			});

		} catch (error) {
			console.error('Error fetching todos:', error);
			return res.status(500).json({ error: 'Failed to fetch todos' });
		}
	} else if (req.method === 'POST') {
		const { title } = req.body
		await prisma.todo.create({
			data: { title },
		})
		res.status(201).end()
	} else {
		res.status(405).json({ error: 'Method not allowed' })
	}
}
