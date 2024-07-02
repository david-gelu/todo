'use client'
import { todoType } from '@/types/todoTypes'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { Dispatch, SetStateAction, useState } from 'react'
import { editPrice } from '@/app/actions/ToDoActions'
import { FaSave, FaEdit, FaUndo } from "react-icons/fa";

export const EditPrice = (props: { todo: todoType, setRefresh: Dispatch<SetStateAction<boolean>> }) => {
	const { todo, setRefresh } = props
	const [editPriceState, setEditPriceState] = useState(false)
	const handleEditPrice = async (formData: FormData) => {
		try {
			await editPrice(formData);
		} catch (error) {
			console.error('Failed to edit ToDo:', error);
		} finally {
			setRefresh(prev => !prev)
		}
	}
	const handlePrice = () => {
		if (todo.isCompleted) return
		setEditPriceState(!editPriceState)
	}
	const handleSubmitPrice = async () => {
		setEditPriceState(false)
	}

	return (
		<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
			{editPriceState ?
				<Form action={handleEditPrice} onSubmit={handleSubmitPrice}>
					<Input name='inputId' type='hidden' value={todo.id} />
					<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
						<Input name='newPrice' type="text" placeholder='Edit Price ...' />
						<Button type='submit' text={<FaSave />} onClick={() => setRefresh(prev => !prev)} />
					</div>
				</Form> : <></>}
			<Button
				onClick={handlePrice}
				text={!editPriceState ? <FaEdit /> : <FaUndo />}
			/>
		</div>
	)
}
