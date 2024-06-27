import React from 'react'
import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { changeStatus } from '@/app/actions/ToDoActions'
import { todoType } from '@/types/todoTypes'
import { IoMdCheckboxOutline } from "react-icons/io"
import { MdCheckBoxOutlineBlank } from "react-icons/md"

export const ChangeToDo = (props: { todo: todoType }) => {
    const { todo } = props

    return (
        <div style={{ maxWidth: 'max-content', display: 'flex', alignItems: 'center' }}>
            <Form action={changeStatus}>
                <Input
                    name='inputId'
                    value={todo.id}
                    type='hidden' />
                <Button actionButton type='submit' text={todo.isCompleted ? <IoMdCheckboxOutline /> : <MdCheckBoxOutlineBlank />} />
            </Form>
        </div>
    )
}
