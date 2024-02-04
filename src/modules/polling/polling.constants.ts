export const PRECIPITATION = {
    TOO_LOW: { min: 0.0, max: 0.2, descripcion: "Cielo mayormente despejado o llovizna muy ligera", condition: true},
    LOW: { min: 0.2, max: 1.0, descripcion: "Posibles lloviznas dispersas", condition: true},
    MODERATE: { min: 1.0, max: 2.5, descripcion: "Lluvia ligera", condition: false},
    HIGH: { min: 2.5, max: 10.0, descripcion: "Lluvia moderada a intensa", condition: false},
    TOO_HIGH: { min: 10.0, max: Infinity, descripcion: "Lluvia intensa, posibles tormentas", condition: false}
};