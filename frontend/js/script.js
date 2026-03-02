const API = "http://localhost:3000/api";

// ================= NAVBAR =================
document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.getElementById("navLinks");
    const token = localStorage.getItem("token");

    if (navLinks) {
        if (token) {
            navLinks.innerHTML = `
                <a href="/index.html">Inicio</a>
                <button id="logoutBtn">Cerrar sesión</button>
            `;

            document.getElementById("logoutBtn").addEventListener("click", () => {
                localStorage.removeItem("token");
                window.location.href = "/login.html";
            });

        } else {
            navLinks.innerHTML = `
                <a href="/index.html">Inicio</a>
                <a href="/login.html">Login</a>
                <a href="/register.html">Register</a>
            `;
        }
    }
});


// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        try {
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Error al registrar");
                return;
            }

            alert("Usuario registrado correctamente");
            window.location.href = "/login.html";

        } catch (error) {
            alert("Error del servidor");
        }
    });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        try {
            const res = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Credenciales incorrectas");
                return;
            }

            // Guardar JWT
            localStorage.setItem("token", result.token);

            // Redirigir
            window.location.href = "/index.html";

        } catch (error) {
            alert("Error del servidor");
        }
    });
}


// ================= ESCULTURAS =================
const formEscultura = document.getElementById("formEscultura");
const lista = document.getElementById("listaEsculturas");

if (formEscultura) {

    cargarEsculturas();

    formEscultura.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login.html";
            return;
        }

        const data = {
            nombre: document.getElementById("nombre").value,
            precio: document.getElementById("precio").value,
            material: document.getElementById("material").value
        };

        try {
            await fetch(`${API}/esculturas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            formEscultura.reset();
            cargarEsculturas();

        } catch (error) {
            alert("Error al guardar escultura");
        }
    });
}

async function cargarEsculturas() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const res = await fetch(`${API}/esculturas`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }

        const data = await res.json();

        if (!lista) return;

        lista.innerHTML = "";

        data.forEach(escultura => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
        <h3>${escultura.nombre}</h3>
        <p>Precio: ₡${escultura.precio}</p>
        <p>Material: ${escultura.material}</p>
        <button class="btn-eliminar" data-id="${escultura._id}">
            Eliminar
        </button>
    `;

    lista.appendChild(div);
});
    } catch (error) {
        alert("Error al cargar esculturas");
    }
}
document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("btn-eliminar")) {

        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");

        if (!confirm("¿Seguro que deseas eliminar esta escultura?")) return;

        try {
            const res = await fetch(`${API}/esculturas/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                alert("Error al eliminar");
                return;
            }

            cargarEsculturas();

        } catch (error) {
            alert("Error del servidor");
        }
    }
});

async function eliminarEscultura(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/esculturas/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
        alert("Error al eliminar");
        return;
    }

    alert("Eliminado correctamente");
    cargarEsculturas();
}