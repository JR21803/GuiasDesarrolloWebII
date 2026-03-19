import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { BotonEliminarReserva } from "./boton-eliminar";
import { BotonCancelarReserva } from "./boton-cancelar";
import { BotonConfirmarReserva } from "./boton-confirmar";

import { tarjeta } from "@/app/lib/estilos";

const etiquetaEstado: Record<string, string> = {
    pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmada: "bg-green-50 text-green-700 border-green-200",
    cancelada: "bg-gray-100 text-gray-500 border-gray-200",
};

export default async function PaginaReservas(props: {
    searchParams?: { estado?: string };
}) {

    const searchParams = await props.searchParams;
    const filtroEstado = searchParams?.estado;

    const reservas = await prisma.reserva.findMany({
        where: filtroEstado ? { estado: filtroEstado } : {} ,
        orderBy: { fecha: "asc" },
        include: { servicio: true },
    });

    const conteoEstados = await prisma.reserva.groupBy({
        by: ["estado"],
        _count: true,
    });

    const totalPendientes = conteoEstados.find((estado) => estado.estado === "pendiente")?._count || 0;
    const totalConfirmadas = conteoEstados.find((estado) => estado.estado === "confirmada")?._count || 0;
    const totalCanceladas = conteoEstados.find((estado) => estado.estado === "cancelada")?._count || 0;
    

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">Reservas</h1>
                <Link
                    href="/reservas/nueva"
                    className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                >
                    Nueva reserva
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <Link
                    href="/reservas"
                    className={`px-4 py-2 rounded text-sm transition-colors ${!filtroEstado ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                    Todas ({totalPendientes + totalConfirmadas + totalCanceladas})

                </Link>
                <Link
                    href="/reservas?estado=pendiente"
                    className={`px-4 py-2 rounded text-sm transition-colors ${filtroEstado === 'pendiente' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                    Pendientes ({totalPendientes})
                </Link>
                <Link
                    href="/reservas?estado=confirmada"
                    className={`px-4 py-2 rounded text-sm transition-colors ${filtroEstado === 'confirmada' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                    Confirmadas ({totalConfirmadas})
                </Link>
                <Link
                    href="/reservas?estado=cancelada"
                    className={`px-4 py-2 rounded text-sm transition-colors ${filtroEstado === 'cancelada' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                    Canceladas ({totalCanceladas})
                </Link> 
            </div>



            {reservas.length === 0 ? (
                <p className="text-sm text-gray-400">No hay reservas registradas.</p>
            ) : (
                <ul className="space-y-3">
                    {reservas.map((reserva) => (
                        <li
                            key={reserva.id}
                            className={`${tarjeta} flex items-start justify-between`}
                        >
                            <div>
                                <p className="font-medium text-sm">{reserva.nombre}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{reserva.correo}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {reserva.servicio.nombre} —{" "}
                                    {new Date(reserva.fecha).toLocaleString("es-SV")}
                                </p>
                                <span
                                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente
                                        }`}
                                >
                                    {reserva.estado}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {reserva.estado === 'pendiente' && (
                                    <BotonConfirmarReserva id={reserva.id} />
                                )}
                            </div>
                            <div className="flex items-center">
                                {reserva.estado !== "cancelada" && (
                                    <>
                                        <BotonEliminarReserva id={reserva.id} />
                                        <BotonCancelarReserva id={reserva.id} />
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
