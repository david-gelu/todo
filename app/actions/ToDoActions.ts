"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/utils/prisma"
import { notifyClients } from "@/server/websocket"

export const createToDo = async (formData: FormData) => {
    const input = formData.get("input") as string
    const price = formData.get("price") as string

    if (!input.trim()) return


    await prisma.todo.create({
        data: { title: input, price }
    })
    await notifyClients()
    revalidatePath("/")
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
    await notifyClients()
    revalidatePath("/")

    return updatedStatus
}

export const editToDo = async (formData: FormData) => {
    const newTitle = formData.get('newTitle') as string
    const inputId = formData.get('inputId') as string

    await prisma.todo.update({
        where: { id: inputId },
        data: { title: newTitle }
    })
    await notifyClients()
    revalidatePath("/")

}
export const editPrice = async (formData: FormData) => {
    const newPrice = formData.get('newPrice') as string
    const inputId = formData.get('inputId') as string

    await prisma.todo.update({
        where: { id: inputId },
        data: { price: newPrice }
    })
    await notifyClients()
    revalidatePath("/")
}

export const deleteToDo = async (formData: FormData) => {
    const inputId = formData.get('inputId') as string

    await prisma.todo.delete({
        where: { id: inputId }
    })
    await notifyClients()
    revalidatePath("/")
}