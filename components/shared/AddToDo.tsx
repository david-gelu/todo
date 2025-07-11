'use client'

import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createToDo } from '@/app/actions/ToDoActions'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

const AddToDo = ({ setRefresh }: { setRefresh: Dispatch<SetStateAction<boolean>> }) => {
	const [loading, setLoading] = useState(false);
	const handleCreateToDo = async (formData: FormData) => {
		setLoading(true)
		try {
			await createToDo(formData);
		} catch (error) {
			console.error('Failed to create ToDo:', error);
		} finally {
			setLoading(false);
		}
		setRefresh(prev => !prev)
	}

	return (
		<Form action={handleCreateToDo} className='change-latter'>
			<div className='add-todo'>
				<Input name='input' type='text' placeholder='Add todo...' />
				<Button
					className='m-width'
					type='submit'
					text={`${loading ? 'Sending...' : 'Add'}`}
					actionButton
					disabled={loading}
				/>
			</div>
		</Form>
	)
}

export default AddToDo