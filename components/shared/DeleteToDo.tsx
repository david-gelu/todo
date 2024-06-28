
'use client'
import { todoType } from '@/types/todoTypes'
import { deleteToDo } from '@/app/actions/ToDoActions'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { RiDeleteBin5Fill } from "react-icons/ri";

export const DeleteToDo = (props: { todo: todoType }) => {
    const { todo } = props
    return (
        <Form action={deleteToDo} >
            <Input type='hidden'
                name='inputId'
                value={todo.id}
            />
            <Button text={<RiDeleteBin5Fill />} type='submit' />
        </Form>
    )
}
