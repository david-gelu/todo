'use client'
import { todoType } from '@/types/todoTypes'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { editToDo } from '@/app/actions/ToDoActions'
import { FaSave, FaEdit, FaUndo } from "react-icons/fa";

export const EditToDo = (props: { todo: todoType, setRefresh: Dispatch<SetStateAction<boolean>> }) => {
  const { todo, setRefresh } = props
  const [editTodo, setEditTodo] = useState(false)

  const handleEditToDo = async (formData: FormData) => {
    try {
      await editToDo(formData);
    } catch (error) {
      console.error('Failed to edit ToDo:', error);
    } finally {
      setRefresh(prev => !prev)
    }
  }

  const handleEdit = () => {
    if (todo.isCompleted) return
    setEditTodo(!editTodo)
  }
  const handleSubmit = () => {
    setEditTodo(false)
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
      {editTodo ?
        <Form action={handleEditToDo} onSubmit={handleSubmit}>
          <Input name='inputId' type='hidden' value={todo.id} />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', }}>
            <Input name='newTitle' type="text" placeholder='Edit ToDo ...' />
            <Button type='submit' text={<FaSave />} onClick={() => setRefresh(prev => !prev)} />
          </div>
        </Form> : <></>
      }
      <Button
        onClick={handleEdit}
        text={!editTodo ? <FaEdit /> : <FaUndo />}
      />
    </div >
  )
}
