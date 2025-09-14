'use client'

import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAddTodo } from '@/hooks/useTodos'
import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'

const AddToDo = () => {
	const formRef = useRef<HTMLFormElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [inputValue, setInputValue] = useState('')
	const addTodoMutation = useAddTodo()

	const handleCreateToDo = async (formData: FormData) => {
		try {
			if (!inputValue.trim()) {
				return
			}

			await addTodoMutation.mutateAsync(formData)

			setInputValue('')
			formRef.current?.reset()
			inputRef.current?.focus()
		} catch (error) {
			console.error('Failed to create ToDo:', error)
		}
	}

	return (
		<Form ref={formRef} action={handleCreateToDo} className='change-latter'>
			<div className='add-todo'>
				<Input
					ref={inputRef}
					name='input'
					type='text'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder='Adauga produs...'
					required
				/>
				<Button
					className='m-width-'
					type='submit'
					text={addTodoMutation.isPending ? 'Se adaugă...' : 'Adaugă'}
					actionButton
					disabled={addTodoMutation.isPending || !inputValue.trim()}
				/>
			</div>
		</Form>
	)
}

export default AddToDo
