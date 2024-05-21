const express = require('express');
const fs = require('fs');
const router = express.Router();

const CARTS_FILE = './data/carritos.json';

// Ruta raíz POST /api/carts/
router.post('/', (req, res) => {
    fs.readFile(CARTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        const carts = JSON.parse(data);
        const newCart = {
            id: Math.random().toString(36).substr(2, 9), // Generar un ID aleatorio
            products: []
        };
        carts.push(newCart);
        fs.writeFile(CARTS_FILE, JSON.stringify(carts), err => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            res.status(201).json(newCart);
        });
    });
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    fs.readFile(CARTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }
        res.json(cart.products);
    });
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    fs.readFile(CARTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        let carts = JSON.parse(data);
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }
        let cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(p => p.id === productId);
        if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementa la cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no existe en el carrito, agrégalo con cantidad 1
            cart.products.push({ id: productId, quantity: 1 });
        }
        fs.writeFile(CARTS_FILE, JSON.stringify(carts), err => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            res.json(cart);
        });
    });
});

module.exports = router;
