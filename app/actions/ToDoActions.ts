"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/utils/prisma"

export const createToDo = async (formData: FormData) => {
    const input = formData.get("input") as string

    if (!input.trim()) return

    await prisma.todo.create({
        data: {
            title: input,
            createdAt: new Date(),
        }
    })
    revalidatePath('/', 'layout')
}

export const changeStatus = async (formData: FormData) => {
    const inputId = formData.get('inputId') as string
    const todo = await prisma.todo.findUnique({
        where: { id: inputId }
    })
    if (!todo) return

    const updatedStatus = !todo?.isCompleted

    await prisma.todo.update({
        where: { id: inputId },
        data: { isCompleted: updatedStatus }
    })
    revalidatePath('/', 'layout')
    return updatedStatus
}

export const editToDo = async (formData: FormData) => {
    const newTitle = formData.get('newTitle') as string
    const inputId = formData.get('inputId') as string

    await prisma.todo.update({
        where: { id: inputId },
        data: { title: newTitle }
    })
    revalidatePath('/', 'layout')
}

export const deleteToDo = async (formData: FormData) => {
    const inputId = formData.get('inputId') as string

    await prisma.todo.delete({
        where: { id: inputId }
    })
    revalidatePath('/', 'layout')
}