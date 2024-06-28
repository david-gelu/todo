'use client'
import { todoType } from '@/types/todoTypes'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useState } from 'react'
import { editPrice } from '@/app/actions/ToDoActions'
import { FaSave, FaEdit, FaUndo } from "react-icons/fa";

export const EditPrice = (props: { todo: todoType }) => {
    const { todo } = props
    const [editPriceState, setEditPriceState] = useState(false)

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
                <Form action={editPrice} onSubmit={handleSubmitPrice}>
                    <Input name='inputId' type='hidden' value={todo.id} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
                        <Input name='newPrice' type="text" placeholder='Edit Price ...' />
                        <Button type='submit' text={<FaSave />} />
                    </div>
                </Form> : <></>}
            <Button
                onClick={handlePrice}
                text={!editPriceState ? <FaEdit /> : <FaUndo />}
            />
        </div>
    )
}
