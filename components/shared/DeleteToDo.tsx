
'use client'
import { todoType } from '@/types/todoTypes'
import { deleteToDo } from '@/app/actions/ToDoActions'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useQueryClient } from '@tanstack/react-query'

export const DeleteToDo = (props: { todo: todoType }) => {
	const { todo } = props
	const queryClient = useQueryClient();
	const handleDeleteToDo = async (formData: FormData) => {
		try {
			await deleteToDo(formData);
		} catch (error) {
			console.error('Failed to edit ToDo:', error);
		}
		finally {
			queryClient.invalidateQueries({ queryKey: ['todos'] })
		}
	}
	return (
		<div style={{ maxWidth: 'max-content', display: 'flex', alignItems: 'center' }} >
			<Form action={handleDeleteToDo}>
				<Input type='hidden'
					name='inputId'
					value={todo.id}
				/>
				<Button text={<RiDeleteBin5Fill className="todo-icon" />} type='submit' />
			</Form>
		</div>
	)
}
