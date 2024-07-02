
'use client'
import { todoType } from '@/types/todoTypes'
import { deleteToDo } from '@/app/actions/ToDoActions'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Dispatch, SetStateAction } from 'react'

export const DeleteToDo = (props: { todo: todoType, setRefresh: Dispatch<SetStateAction<boolean>> }) => {
	const { todo, setRefresh } = props
	const handleDeleteToDo = async (formData: FormData) => {
		try {
			await deleteToDo(formData);
		} catch (error) {
			console.error('Failed to edit ToDo:', error);
		} finally {
			setRefresh(prev => !prev)
		}
	}
	return (
		<div style={{ maxWidth: 'max-content', display: 'flex', alignItems: 'center' }} >
			<Form action={handleDeleteToDo}>
				<Input type='hidden'
					name='inputId'
					value={todo.id}
				/>
				<Button text={<RiDeleteBin5Fill />} type='submit' onClick={() => setRefresh(prev => !prev)} />
			</Form>
		</div>
	)
}
