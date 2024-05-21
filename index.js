const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware para parsear el body de las solicitudes
app.use(express.json());

// Middleware para manejar las rutas de productos
app.use('/api/products', productsRouter);

// Middleware para manejar las rutas de carritos
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
