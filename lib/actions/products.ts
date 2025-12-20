"use server"
import { prisma } from "@/prisma/seed"
import { getCurrentUser } from "../auth"
import { z } from "zod"
import { redirect } from "next/navigation"

const ProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    sku: z.string().min(3, "SKU must be at least 3 characters long").optional(),
    price: z.number().min(0, "Price must be at least 0"),
    quantity: z.number().min(0, "Quantity must be at least 0"),
    lowStockAt: z.coerce.number().int().min(0, "Low stock at must be at least 0").optional(),
})

export async function deleteProduct(formData: FormData) {
    const id = String(formData.get("id"))
    const user = await getCurrentUser()

    await prisma.product.deleteMany({
        where: {
            id,
            userId: user.id
        }
    })

}

export async function addProduct(formData: FormData) {
    const user = await getCurrentUser()
    const parsed = ProductSchema.safeParse({
        name: formData.get("name"),
        sku: formData.get("sku") || undefined,
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        lowStockAt: Number(formData.get("lowStockAt")) || undefined,
    })

    if (!parsed.success) {
        throw new Error(parsed.error.message)
    }

    try {
        const product = await prisma.product.create({
            data: {
                ...parsed.data,
                userId: user.id
            }
        })
        if (!product) {
            throw new Error("Failed to add product from server")
        }
    } catch (error) {
        console.log(error)
        throw new Error("Failed to add product")
    }

}