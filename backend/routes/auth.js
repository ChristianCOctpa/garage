const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ msg: "Usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new User({
            nombre,
            email,
            password: hashedPassword
        });

        await nuevoUsuario.save();

        res.json({ msg: "Usuario registrado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) return res.status(400).json({ msg: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;