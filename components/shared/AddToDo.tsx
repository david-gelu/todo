import Form from '../ui/Form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createToDo } from '@/app/actions/ToDoActions'

const AddToDo = () => {
    return (
        <Form action={createToDo} className='change-latter'>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Input name='input' type='text' placeholder='Add todo...' />
                <Input name='price' type='text' placeholder='Add price...' />
                <Button type='submit' text='Add' actionButton />
            </div>
        </Form>
    )
}

export default AddToDo