'use client'
import React, { Dispatch, SetStateAction } from 'react'
import moment from 'moment'
import 'moment/locale/ro';
import { ChangeToDo } from './ChangeToDo';
import { todoType } from '@/types/todoTypes';
import { DeleteToDo } from './DeleteToDo';
import { EditToDo } from './EditToDo';
import { EditPrice } from './EditPrice';

export const ToDo = (props: {
    todo: todoType, setRefresh: Dispatch<SetStateAction<boolean>>
}) => {
    const { todo, setRefresh } = props

    return (
        <>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem', color: todo.isCompleted ? 'green' : 'red', borderRadius: '1rem'
                , boxShadow: ' 0px 0px 3px #000', padding: '0.5rem', height: '100%'
            }}>
                <ChangeToDo setRefresh={setRefresh} todo={todo} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', fontWeight: 'bold', flexBasis: '100%' }}>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', fontWeight: 'bold', flexBasis: '100%' }}>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: '.5rem', textAlign: 'start' }}>{todo.title} <EditToDo setRefresh={setRefresh} todo={todo} /></div>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: '.5rem', textAlign: 'start' }}>Pret: {todo.price} lei <EditPrice setRefresh={setRefresh} todo={todo} /></div>
                    </div>
                    <div style={{ fontSize: '.5rem' }}>{moment(todo.createdAt).locale('ro').format('L')}</div>
                </div>
                <DeleteToDo setRefresh={setRefresh} todo={todo} />
            </div>
        </>
    )
}
