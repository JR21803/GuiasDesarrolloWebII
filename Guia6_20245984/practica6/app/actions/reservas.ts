"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

// Esquema de validación para el formulario de reserva.
// serviciold llega como string desde el select y se convierte a número con z.coerce.
const EsquemaReserva = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    correo: z.string().email("El correo no es válido."),
    fecha: z.string().min(1, "La fecha es obligatoria."),
    servicioId: z.coerce.number().positive("El servicio es obligatorio."),
});

/*
async function validarDisponibilidad(servicioId: number, fechaInicio: Date, reservaExcluir?: number): Promise<{ disponible: boolean, mensaje?: string }> {
    
    const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });
    if (!servicio) {
        return { disponible: false, mensaje: "Servicio no encontrado." };
    }

    const fechaNueva = new Date(fechaInicio.getTime() + (servicio.duracion * 60 * 1000));

    const reservasConflicto = await prisma.reserva.findMany({ where: { servicioId, estado: { not: "cancelada" }, NOT: reservaExcluir ? { id: reservaExcluir } : undefined} 
    
    });

    for (const reserva of reservasConflicto) {
        const reservaFecha = new Date(reserva.fecha);
        const reservaFechaNueva = new Date(reservaFecha.getTime() + (servicio.duracion * 60 * 1000));
        if (reservaFechaNueva > fechaNueva) {
            return { disponible: false, mensaje: "No hay espacio disponible." };
        }

    if (reservasConflicto.length > 0) {
        return { disponible: false, mensaje: "No hay espacio disponible." };
    }
    return { disponible: true };


}
*/

// Crea una nueva reserva asociada a un servicio existente.
// La fecha se convierte a objeto Date antes de guardarse en la base de datos.
export async function crearReserva(_estadoPrevio: any, formData: FormData) {
    const campos = EsquemaReserva.safeParse({
        nombre: formData.get("nombre"),
        correo: formData.get("correo"),
        fecha: formData.get("fecha"),
        servicioId: formData.get("servicioId"),
    });
    // Si la validación falla, se retorna el objeto de errores al componente.
    if (!campos.success) {
        return {
            errores: campos.error.flatten().fieldErrors,
            mensaje: "Error de validación.",
        };
    }
    await prisma.reserva.create({
        data: {
            nombre: campos.data.nombre,
            correo: campos.data.correo,
            fecha: new Date(campos.data.fecha),
            servicioId: campos.data.servicioId,
        },
    });

    revalidatePath("/reservas");
    redirect("/reservas");
}
// Elimina una reserva por ID.
// Retorna un objeto de resultado para que el componente pueda mostrar un error si falla.
export async function eliminarReserva(id: number) {
    try {
        await prisma.reserva.delete({ where: { id } });
        revalidatePath("/reservas");
        return { exito: true };
    } catch {
        return { exito: false, mensaje: "No se pudo eliminar la reserva." };
    }
}

export async function cancelarReserva(id: number) {
    try {
        await prisma.reserva.update({ where: { id }, data: { estado: "cancelada" } });
        revalidatePath("/reservas");
        return { exito: true };
    } catch {
        return { exito: false, mensaje: "No se pudo cancelar la reserva." };
    }
}

export async function confirmarReserva(id: number) {
    try {
        await prisma.reserva.update({ where: { id }, data: { estado: "confirmada" } });
        revalidatePath("/reservas");
        return { exito: true };
    } catch {
        return { exito: false, mensaje: "No se pudo confirmar la reserva." };
    }
}