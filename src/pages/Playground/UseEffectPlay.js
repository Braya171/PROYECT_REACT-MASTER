// useEffect se usa para ejecutar código cuando el componente se monta o cambian datos.
// En este ejemplo, muestra un mensaje en pantalla y en consola cada vez que cambia el número.
// Además incluye un botón para lanzar un SweetAlert.

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function UseEffectPlay() {
  const [numero, setNumero] = useState(0);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    console.log("El número cambió:", numero);
    setMensaje(`¡El número cambió a: ${numero}!`);

    Swal.fire({
      title: "Número actualizado",
      text: `Ahora el número es ${numero}`,
      icon: "info",
      timer: 1200,
      showConfirmButton: false
    });
  }, [numero]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Ejemplo de useEffect</h2>
      <p>{mensaje}</p>
      <p>Valor actual: {numero}</p>
      <button onClick={() => setNumero(numero + 1)} className="btn btn-primary me-2">
        Incrementar
      </button>
    </div>
  );
}

export default UseEffectPlay;
