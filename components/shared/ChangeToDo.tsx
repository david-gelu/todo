import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { changeStatus } from '@/app/actions/ToDoActions'
import { todoType } from '@/types/todoTypes'
import { IoMdCheckboxOutline } from "react-icons/io"
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import { useQueryClient } from '@tanstack/react-query'

export const ChangeToDo = (props: { todo: todoType }) => {
    const { todo } = props
    const queryClient = useQueryClient();
    const handleChangeStatus = async (formData: FormData) => {
        try {
            await changeStatus(formData);
        } catch (error) {
            console.error('Failed to edit ToDo:', error);
        } finally {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
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
                    text={
                        todo.isCompleted
                            ? <IoMdCheckboxOutline className="todo-icon" />
                            : <MdCheckBoxOutlineBlank className="todo-icon" />
                    }
                />
            </Form>
        </div>
    )
}
