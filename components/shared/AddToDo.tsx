'use client'

import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createToDo } from '@/app/actions/ToDoActions'
import { useState, useRef, Dispatch, SetStateAction } from 'react'

const AddToDo = ({ setRefresh }: { setRefresh: Dispatch<SetStateAction<boolean>> }) => {
	const [loading, setLoading] = useState(false)
	const formRef = useRef<HTMLFormElement>(null)

	const handleCreateToDo = async (formData: FormData) => {
		setLoading(true)
		try {
			await createToDo(formData)
			formRef.current?.reset()
		} catch (error) {
			console.error('Failed to create ToDo:', error)
		} finally {
			setLoading(false)
		}
		setRefresh(prev => !prev)
	}

	return (
		<Form ref={formRef} action={handleCreateToDo} className='change-latter'>
			<div className='add-todo'>
				<Input name='input' type='text' placeholder='Adauga produs...' />
				<Button
					className='m-width-'
					type='submit'
					text={`${loading ? 'Se adauga...' : 'Adauga'}`}
					actionButton
					disabled={loading}
				/>
			</div>
		</Form>
	)
}

export default AddToDo
