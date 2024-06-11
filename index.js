const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para la página principal
app.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
  res.render('index', { products });
});

// Ruta para eliminar un producto
app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
  products = products.filter(product => product.id !== id);
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
  res.redirect('/');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
