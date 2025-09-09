'use client'

import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useAddTodo } from '@/hooks/useTodos'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const AddToDo = () => {
	const formRef = useRef<HTMLFormElement>(null)
	const queryClient = useQueryClient();
	const addTodoMutation = useAddTodo()

	const handleCreateToDo = async (formData: FormData) => {
		try {
			await addTodoMutation.mutateAsync(formData)
			formRef.current?.reset()
		} catch (error) {
			console.error('Failed to create ToDo:', error)
		} finally {
			queryClient.invalidateQueries({ queryKey: ['todos'] })
		}
	}

	return (
		<Form ref={formRef} action={handleCreateToDo} className='change-latter'>
			<div className='add-todo'>
				<Input name='input' type='text' placeholder='Adauga produs...' />
				<Button
					className='m-width-'
					type='submit'
					text={addTodoMutation.isPending ? 'Se adaugă...' : 'Adaugă'}
					actionButton
					disabled={addTodoMutation.isPending}
				/>
			</div>
		</Form>
	)
}

export default AddToDo
