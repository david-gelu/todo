'use client'
import { todoType } from '@/types/todoTypes'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useState } from 'react'
import { editToDo } from '@/app/actions/ToDoActions'
import { FaSave, FaEdit, FaUndo } from "react-icons/fa";

export const EditToDo = (props: { todo: todoType }) => {
    const { todo } = props
    const [editTodo, setEditTodo] = useState(false)

    const handleEdit = () => {
        if (todo.isCompleted) return
        setEditTodo(!editTodo)
    }
    const handleSubmit = async () => {
        setEditTodo(false)
    }

    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
            {editTodo ?
                <Form action={editToDo} onSubmit={handleSubmit}>
                    <Input name='inputId' type='hidden' value={todo.id} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
                        <Input name='newTitle' type="text" placeholder='Edit ToDo ...' />
                        <Button type='submit' text={<FaSave />} />
                    </div>
                </Form> : <></>}
            <Button
                onClick={handleEdit}
                text={!editTodo ? <FaEdit /> : <FaUndo />}
                actionButton
            />
        </div>
    )
}
