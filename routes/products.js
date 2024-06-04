const express = require('express');
const fs = require('fs');
const router = express.Router();

const PRODUCTS_FILE = './data/productos.json';

// Middleware para validar campos obligatorios
function validateFields(req, res, next) {
    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    next();
}

// Ruta raíz GET /api/products/
router.get('/', (req, res) => {
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        const products = JSON.parse(data);
        // Lógica para devolver todos los productos
        res.json(products);
    });
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        const products = JSON.parse(data);
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(product);
    });
});

// Ruta POST /api/products/
router.post('/', validateFields, (req, res) => {
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        const products = JSON.parse(data);
        const newProduct = {
            id: Math.random().toString(36).substr(2, 9), // Generar un ID aleatorio
            ...req.body,
            status: true // Por defecto
        };
        products.push(newProduct);
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), err => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            res.status(201).json(newProduct);
        });
    });
});

// Ruta PUT /api/products/:pid
router.put('/:pid', validateFields, (req, res) => {
    const productId = req.params.pid;
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        products[productIndex] = { ...products[productIndex], ...req.body };
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), err => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            res.json(products[productIndex]);
        });
    });
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        let products = JSON.parse(data);
        const filteredProducts = products.filter(p => p.id !== productId);
        if (products.length === filteredProducts.length) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(filteredProducts), err => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            res.json({ message: 'Producto eliminado correctamente.' });
        });
    });
});

module.exports = router;
