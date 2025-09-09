'use client'
import moment from 'moment'
import 'moment/locale/ro';
import { ChangeToDo } from './ChangeToDo';
import { todoType } from '@/types/todoTypes';
import { DeleteToDo } from './DeleteToDo';
import { EditToDo } from './EditToDo';

export const ToDo = (props: {
    todo: todoType
}) => {
    const { todo } = props

    return (
        <div
            className={`todo-item ${todo.isCompleted ? 'todo-completed' : 'todo-incomplete'}`}
        >
            <ChangeToDo todo={todo} />
            <div className="todo-content">
                <div className="todo-title-date">
                    <div className="todo-title">{todo.title}</div>
                    <div className="todo-date">{moment(todo.createdAt).locale('ro').format('L')}</div>
                </div>
                <EditToDo todo={todo} />
            </div>
            <DeleteToDo todo={todo} />
        </div>
    )
}
