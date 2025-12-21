'use server'

import { prisma } from '@/lib/db'

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } })
}
