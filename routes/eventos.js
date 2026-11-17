const express = require('express');
const router = express.Router();
const Evento = require('../models/evento');

//EndPoint 1
router.get('/', async (req, res) => {
    try {
        const resultado = await Evento.find().populate('recinto');
        if(!resultado || resultado.length === 0){
            throw new Error("No se han encontrado recintos");
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(500).send({ok: false, error: "No se han encontrado eventos"});
    }
});

//EndPoint 2
router.get('/localidad/:nombre', async (req, res) => {
    try {
        const resultadoPorFecha = await Evento.filter({ fecha: { $gte: new Date() } }).populate('recinto');
        const resultado = /* ^ Array filtrado ahora por existencia y localidad */   
        resultadoPorFecha.filter((e) => {
            if(e)
                return e.recinto && e.recinto.localidad === req.params.nombre;
        });
        if(!resultado || resultado.length === 0){
            throw new Error("No se han encontrado eventos");
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: "No se han encontrado eventos"});
    }
});

//EndPoint 3
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findById(req.params.id).populate('recinto');
        if(!resultado){
            throw new Error(`Evento ${req.params.id} no encontrado`);
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Evento ${req.params.id} no encontrado`});
    }
});

//EndPoint 4
router.post('/', async (req, res) => {
    try {
        const nuevoEvento = new Evento(req.body);
        const resultado = await nuevoEvento.save();
        if(!resultado){
            throw new Error("Error añadiendo evento");
        } else{
            res.status(201).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(500).send({ok: false, error: "Error añadiendo evento"});
    }
});

//EndPoint 5
router.put('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndUpdate(
            req.params.id, 
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if(!resultado){
            throw new Error(`Error actualizando evento ${req.params.id}`);
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Error actualizando evento ${req.params.id}`});
    }
});

//EndPoint 6
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndDelete(req.params.id);
        if(!resultado){
            throw new Error(`Error eliminando evento ${req.params.id}`);
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Error eliminando evento ${req.params.id}`});
    }
});

//EndPoint 7
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        if(!evento){
            throw new Error(`Error obteniendo datos de entrada para evento ${req.params.idEvento}`);
        }
        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada)
        if(!entrada){
            throw new Error(`Error obteniendo datos de entrada tipo ${req.params.tipoEntrada}`);
        }
        else{
            res.status(200).send({ok: true, resultado: { precio: entrada.precio, disponibles: entrada.disponibles }});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`});
    }
});

//EndPoint 8
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        if(!evento){
            throw new Error("Evento no encontrado");
        }
        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada)
        const cantidad = Number(req.params.cantidad);
        if(!entrada || cantidad <= 0 || entrada.disponibles < cantidad){
            throw new Error(`Error no existen existencias`);
        } else{
            entrada.disponibles -= cantidad;
            const resultado = await evento.save();
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Error actualizando entradas del evento ${req.params.idEvento}`});
    }
});


module.exports = router;