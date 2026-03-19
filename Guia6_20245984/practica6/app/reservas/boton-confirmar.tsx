"use client";
import { confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonConfirmar } from "@/app/lib/estilos";


export function BotonConfirmarReserva({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);
    const [confirmada, setConfirmada] = useState(false);

    async function manejarClick() {
        const resultado = await confirmarReserva(id);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido.");
        } else {
            setConfirmada(true);
        }
    }

    if (confirmada) {
        return <p className="text-xs text-green-400 mt-1">Reserva confirmada.</p>;
    }

    return (
        <div className="text-right shrink-0 ml-4">
            <button onClick={manejarClick} className={botonConfirmar}>
                Confirmar
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}
