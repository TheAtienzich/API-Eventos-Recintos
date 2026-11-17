const mongoose = require('mongoose');
let entradaSchema = new mongoose.Schema({
    tipo: {
        type: String, 
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0
    }
});

const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    fecha: {
        type: Date,
        required: true
    },
    recinto: {
        type: mongoose.Schema.Types.ObjectId, //Indicado con su ID cojido de 'recintos'
        ref: 'recintos', 
        required: true
    },
    entradas: [entradaSchema]
});

const Evento = mongoose.model('eventos', eventoSchema);
module.exports = Evento;