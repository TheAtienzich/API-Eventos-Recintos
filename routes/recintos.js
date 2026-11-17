const express = require('express');
const router = express.Router();
const Recinto = require('../models/recinto')

//EndPoint 1
router.get('/', async (req, res) => {
    try {
        const resultado = await Recinto.find();
        if(!resultado || resultado.length === 0){
            throw new Error("No se han encontrado recintos");
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(500).send({ok: false, error: "No se han encontrado recintos"});
    }
});

//EndPoint 2
router.get('/localidad/:nombre', async (req, res) => {
    try {
        const resultado = await Recinto.find({localidad: req.params.nombre});
        if(!resultado || resultado.length === 0){
            throw new Error("No se han encontrado recintos de la localidad indicada");
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: "No se han encontrado recintos de la localidad indicada"});
    }
});

//EndPoint 3
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findById(req.params.id);
        if(!resultado){
            throw new Error(`Recinto ${req.params.id} no encontrado`);
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Recinto ${req.params.id} no encontrado`});
    }
});


//EndPoint 4
router.post('/', async (req, res) => {
    try {
        const nuevoRecinto = new Recinto(req.body);
        const resultado = await nuevoRecinto.save();
        if(!resultado){
            throw new Error("Error añadiendo recinto");
        } else{
            res.status(201).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(500).send({ok: false, error: "Error añadiendo recinto"});
    }
});

//EndPoint 5 
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findByIdAndDelete(req.params.id);
        if(!resultado){
            throw new Error(`Error eliminando recinto ${req.params.id}`);
        } else{
            res.status(200).send({ok: true, resultado});
        }
    }
    catch (error) {
        res.status(404).send({ok: false, error: `Error eliminando recinto ${req.params.id}`});
    }
});

module.exports = router;