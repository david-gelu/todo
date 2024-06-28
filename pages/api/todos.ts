// pages/api/todos.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

const getTodos = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const todos = await prisma.todo.findMany({
			select: {
				title: true,
				id: true,
				isCompleted: true,
				createdAt: true,
				price: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
		res.status(200).json(todos)
	} catch (error) {
		console.error('Error fetching todos:', error)
		res.status(500).json({ error: 'Error fetching todos' })
	}
}

export default getTodos