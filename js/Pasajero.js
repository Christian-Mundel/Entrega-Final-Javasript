class Pasajero {
    constructor(entrada) {
        this.apellido = entrada.apellido;
        this.nombre = entrada.nombre;
        this.edad = parseInt(entrada.edad);
        this.destino = entrada.destino;
        this.dni = parseInt(entrada.dni);
    }

    soyMayorDeEdad() {
        return this.edad >= 18;
    }
}
