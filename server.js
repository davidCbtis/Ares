const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect('mongodb+srv://mtzdavid:jugodemanzana73@cluster0.bkymuyd.mongodb.net/proyectoPAEC?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión', err));

// Definir el esquema y modelo para Material
const Material = mongoose.model('Material', new mongoose.Schema({
  nombrePersona: { type: String, required: true },
  tipoMaterial: { type: String, required: true }, // plastico, papel, vidrio, etc.
  cantidad: { type: Number, required: true },
  dia: { type: String, required: true },
  fecha: { type: Date, required: true },
  puntoRecoleccion: { type: String, required: true }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// GET: Mostrar todo el material registrado
app.get('/api/materiales', async (req, res) => {
  try {
    const materiales = await Material.find();
    res.json(materiales);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener materiales' });
  }
});

// POST: agregar nuevo material
app.post('/api/materiales', async (req, res) => {
  try {
    const nuevoMaterial = new Material(req.body);
    await nuevoMaterial.save();
    res.json({ message: '✅ Material agregado correctamente' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al agregar material', error: error.message });
  }
});

// PUT: actualizar material por nombre de persona y tipo de material
app.put('/api/materiales', async (req, res) => {
  const datos = req.body;
  try {
    const actualizado = await Material.findOneAndUpdate(
      { nombrePersona: datos.nombrePersona, tipoMaterial: datos.tipoMaterial },
      datos,
      { new: true } // Return the updated document
    );
    if (actualizado) {
      res.json({ message: 'Material actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Material no encontrado para actualizar. Si deseas agregarlo usa el formulario de agregar.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el material', error: err.message });
  }
});


// DELETE: Eliminar material por nombre de persona y tipo de material
app.delete('/api/materiales/:nombrePersona/:tipoMaterial', async (req, res) => {
  try {
    const result = await Material.findOneAndDelete({ nombrePersona: req.params.nombrePersona, tipoMaterial: req.params.tipoMaterial });
    if (result) {
      res.json({ message: 'Material eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Material no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar material' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
