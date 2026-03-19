"use client";
import { cancelarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonCancelar } from "@/app/lib/estilos";



export function BotonCancelarReserva({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);
    const [cancelada, setCancelada] = useState(false);

    async function manejarClick() {
        if (confirm("¿Estás seguro de que quieres cancelar la reserva?")) {
            const resultado = await cancelarReserva(id);
            if (!resultado.exito) {
                setError(resultado.mensaje ?? "Error desconocido.");
            } else {
                setCancelada(true);
            }
        }
    }

    if (cancelada) {
        return <p className="text-xs text-green-400 mt-1">Reserva cancelada.</p>;
    }

    return (
        <div className="text-right shrink-0 ml-4">
            <button onClick={manejarClick} className={botonCancelar}>
                Cancelar
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}