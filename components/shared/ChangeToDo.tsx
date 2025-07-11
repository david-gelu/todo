import React, { Dispatch, SetStateAction } from 'react'
import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { changeStatus } from '@/app/actions/ToDoActions'
import { todoType } from '@/types/todoTypes'
import { IoMdCheckboxOutline } from "react-icons/io"
import { MdCheckBoxOutlineBlank } from "react-icons/md"

export const ChangeToDo = (props: { todo: todoType, setRefresh: Dispatch<SetStateAction<boolean>> }) => {
    const { todo, setRefresh } = props
    const handleChangeStatus = async (formData: FormData) => {
        console.log('Changing status for ToDo:', todo.id);
        setRefresh(true)
        try {
            await changeStatus(formData);
        } catch (error) {
            console.error('Failed to edit ToDo:', error);
        } finally {
            setRefresh(prev => !prev)
        }
    }
    return (
        <div style={{ maxWidth: 'max-content', display: 'flex', alignItems: 'center' }}>
            <Form action={handleChangeStatus}>
                <Input
                    name='inputId'
                    value={todo.id}
                    type='hidden' />
                <Button
                    type='submit'
                    text={todo.isCompleted ? <IoMdCheckboxOutline /> : <MdCheckBoxOutlineBlank />}
                />
            </Form>
        </div>
    )
}
