'use client'
import React from 'react'
import moment from 'moment'
import 'moment/locale/ro';
import { ChangeToDo } from './ChangeToDo';
import { todoType } from '@/types/todoTypes';
import { DeleteToDo } from './DeleteToDo';
import { EditToDo } from './EditToDo';

export const ToDo = (props: { todo: todoType }) => {
    const { todo } = props

    return (<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: todo.isCompleted ? 'green' : 'red' }}>
        <ChangeToDo todo={todo} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', fontWeight: 'bold', flexBasis: '100%' }}>
            <div style={{ minWidth: '75%' }}>{todo.title}</div>
            <span>{moment(todo.createdAt).locale('ro').format('L')}</span>
        </div>
        <EditToDo todo={todo} />
        <DeleteToDo todo={todo} />
    </div>
    )
}
