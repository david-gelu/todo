'use client'
import React from 'react'
import moment from 'moment'
import 'moment/locale/ro';
import { ChangeToDo } from './ChangeToDo';
import { todoType } from '@/types/todoTypes';
import { DeleteToDo } from './DeleteToDo';
import { EditToDo } from './EditToDo';
import { EditPrice } from './EditPrice';

export const ToDo = (props: { todo: todoType }) => {
    const { todo } = props

    return (<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: todo.isCompleted ? 'green' : 'red' }}>
        <ChangeToDo todo={todo} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', fontWeight: 'bold', flexBasis: '100%' }}>
            <div style={{ minWidth: '55%', display: 'flex', alignItems: 'center', gap: '.5rem' }}>{todo.title} <EditToDo todo={todo} /></div>
            <div style={{ minWidth: '10%', display: 'flex', alignItems: 'center', gap: '.5rem' }}>Pret: {todo.price} lei <EditPrice todo={todo} /></div>
            <span style={{ fontSize: '.75rem' }}>{moment(todo.createdAt).locale('ro').format('L')}</span>
        </div>
        <DeleteToDo todo={todo} />
    </div>
    )
}
