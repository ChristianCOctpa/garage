const mongoose = require("mongoose");

const esculturaSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    material: String,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Escultura", esculturaSchema);