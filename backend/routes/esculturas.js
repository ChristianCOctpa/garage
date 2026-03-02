const express = require("express");
const Escultura = require("../models/Escultura");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ================= OBTENER =================
router.get("/", authMiddleware, async (req, res) => {
    const esculturas = await Escultura.find({ usuario: req.user.id });
    res.json(esculturas);
});

// ================= CREAR =================
router.post("/", authMiddleware, async (req, res) => {
    const { nombre, precio, material } = req.body;

    const nuevaEscultura = new Escultura({
        nombre,
        precio,
        material,
        usuario: req.user.id
    });

    await nuevaEscultura.save();

    res.json(nuevaEscultura);
});

// ================= ELIMINAR (FIX REAL) =================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        console.log("ID:", req.params.id);
        console.log("USER:", req.user.id);

        const escultura = await Escultura.findById(req.params.id);

        if (!escultura) {
            return res.status(404).json({ message: "No encontrada" });
        }

        // Validar dueño
        if (escultura.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        await escultura.deleteOne();

        console.log("Eliminada OK");

        res.json({ message: "Escultura eliminada" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;