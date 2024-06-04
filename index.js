const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta para la vista home
app.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync('products.json'));
    res.render('home', { products });
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    const products = JSON.parse(fs.readFileSync('products.json'));
    res.render('realTimeProducts', { products });
});

// Conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Socket connected');

    // Emitir la lista de productos actual al cliente
    const products = JSON.parse(fs.readFileSync('products.json'));
    socket.emit('initialProducts', products);

    // Manejar la creación de un nuevo producto
    socket.on('newProduct', (newProduct) => {
        products.push(newProduct);
        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
        io.emit('updatedProducts', products);
    });

    // Manejar la eliminación de un producto
    socket.on('deleteProduct', (productId) => {
        const index = products.findIndex(product => product.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
            io.emit('updatedProducts', products);
        }
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
