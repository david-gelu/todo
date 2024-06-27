import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createToDo } from '@/app/actions/ToDoActions'

const AddToDo = () => {
    return (
        <Form action={createToDo} className='change-latter'>
            <div>
                <Input name='input' type='text' placeholder='Add todo...' />
                <Button type='submit' text='Add' />
            </div>
        </Form>
    )
}

export default AddToDo