const PAGE_URL = window.location.origin; // Get the current origin (protocol + hostname + port)

import {createNotification} from "../components/notification.js";

const form = document.getElementById('form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const matchInput = document.getElementById('match-input');
const formBtn = document.getElementById('form-btn');
const notification = document.getElementById('notification')

//Validators (estas variables ya no son estrictamente necesarias para el estado del botón, pero se pueden mantener para el feedback individual de los campos si se desea)
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

// Esta función ahora solo maneja los estilos del input individual
const validation = (input, isValid) => {
    if (input.value === "") {
        input.classList.remove(
            "outline-green-700",
            "outline-red-700"
        );
        input.classList.add("focus:outline-indigo-700");
    } else if (isValid) {
        input.classList.remove(
            "focus:outline-indigo-700",
            "outline-red-700"
        );
        input.classList.add("outline-green-700");
    } else {
        input.classList.remove(
            "focus:outline-indigo-700",
            "outline-green-700"
        );
        input.classList.add("outline-red-700");
    }
};

// Regex validations
const EMAIL_VALIDATION = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const NAME_VALIDATION = /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]*)*$/;

// Función para validar si todos los campos son válidos y actualizar el botón
const validateForm = () => {
    const isNameValid = NAME_VALIDATION.test(nameInput.value);
    const isEmailValid = EMAIL_VALIDATION.test(emailInput.value);
    const isPasswordValid = PASSWORD_VALIDATION.test(passwordInput.value);
    const isMatchValid = passwordInput.value === matchInput.value && passwordInput.value !== '';

    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isMatchValid;

    formBtn.disabled = !isFormValid;

    // Aquí manejamos las clases del botón
    if (isFormValid) {
        formBtn.classList.remove("opacity-40", "cursor-not-allowed"); // Quita las clases de "disabled" de Tailwind
        formBtn.classList.add("bg-indigo-700", "hover:bg-indigo-800"); // Añade las clases de "enabled"
    } else {
        formBtn.classList.add("opacity-40", "cursor-not-allowed"); // Añade las clases de "disabled" de Tailwind
        formBtn.classList.remove("bg-indigo-700", "hover:bg-indigo-800"); // Quita las clases de "enabled"
    }
};

// Eventos de validación
nameInput.addEventListener('input', e => {
    const isValid = NAME_VALIDATION.test(e.target.value);
    validation(e.target, isValid); // Llama a la función de validación para el input individual
    validateForm(); // Llama a la función de validación del formulario completo
});

emailInput.addEventListener('input', e => {
    const isValid = EMAIL_VALIDATION.test(e.target.value);
    validation(e.target, isValid);
    validateForm();
});

passwordInput.addEventListener('input', e => {
    const isValid = PASSWORD_VALIDATION.test(e.target.value);
    validation(e.target, isValid);
    // Asegurarse de que el matchInput también se revalide cuando la contraseña cambia
    const isMatchValid = e.target.value === matchInput.value && matchInput.value !== '';
    validation(matchInput, isMatchValid);
    validateForm();
});

matchInput.addEventListener('input', e => {
    const isValid = e.target.value === passwordInput.value && e.target.value !== '';
    validation(e.target, isValid);
    validateForm();
});

// Inicializa el estado del botón al cargar la página
document.addEventListener('DOMContentLoaded', validateForm);


form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        }

        const {data} = await axios.post(`${PAGE_URL}/api/users`, newUser);

        console.log(data.message);
        createNotification(false, data.message);

        setTimeout(()=>{
            notification.innerHTML = ''
        },5000)

        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        matchInput.value = '';
        // Después de un envío exitoso, es importante revalidar el formulario para deshabilitar el botón
        validateForm();

    } catch (error) {

        if (error.response) {

            console.log(error.response.data.message);
            createNotification(true, error.response.data.message);
        } else {

            console.error("Error de red o conexión:", error.message);
            createNotification(true, "No se pudo conectar con el servidor. Intenta de nuevo.");
        }

        setTimeout(()=>{
            notification.innerHTML = ''
        },5000)
    }
});
