const PAGE_URL = window.location.origin; // Get the current origin (protocol + hostname + port)

//regEx
// Selectors

import {createNotification} from "../components/notification.js";

const form = document.getElementById('form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const matchInput = document.getElementById('match-input');
const formBtn = document.getElementById('form-btn');
const notification = document.getElementById('notification')

//Validators

let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

const validation = (input, isValid) => {
  let isEnabled =
    nameValidation && emailValidation && passwordValidation && matchValidation;
  formBtn.disabled = !isEnabled;
  if (isEnabled) {
    formBtn.classList.remove("bg-indigo-300");
    formBtn.classList.add("bg-indigo-700", "hover:bg-indigo-800", "cursor-pointer");
  } else {
    formBtn.classList.add("bg-indigo-300");
    formBtn.classList.remove(
      "bg-indigo-700",
      "hover:bg-indigo-800",
      "cursor-pointer"
    );
  }

  if (input.value === "") {
    input.classList.remove(
      "focus:ring-green-500",
      "focus:border-green-500",
      "focus:ring-red-500",
      "focus:border-red-500"
    );
    input.classList.add("focus:ring-indigo-500", "focus:border-indigo-500");
  } else if (isValid) {
    input.classList.remove(
      "focus:ring-red-500",
      "focus:border-red-500",
      "focus:ring-indigo-500",
      "focus:border-indigo-500"
    );
    input.classList.add("focus:ring-green-500", "focus:border-green-500");
  } else {
    input.classList.remove(
      "focus:ring-green-500",
      "focus:border-green-500",
      "focus:ring-indigo-500",
      "focus:border-indigo-500"
    );
    input.classList.add("focus:ring-red-500", "focus:border-red-500");
  }
};

// Regex validations
const EMAIL_VALIDATION = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const NAME_VALIDATION = /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]*)*$/;

// Función para validar si todos los campos son válidos
const validateForm = () => {
  const isNameValid = NAME_VALIDATION.test(nameInput.value);
  const isEmailValid = EMAIL_VALIDATION.test(emailInput.value);
  const isPasswordValid = PASSWORD_VALIDATION.test(passwordInput.value);
  const isMatchValid = passwordInput.value === matchInput.value && passwordInput.value !== '';
  
  formBtn.disabled = !(isNameValid && isEmailValid && isPasswordValid && isMatchValid);
};

// Eventos de validación
nameInput.addEventListener('input', e => {
  const nameValidation = NAME_VALIDATION.test(e.target.value);
  e.target.classList.remove('outline-red-700', 'outline-green-700');
  if (e.target.value === '') {
    e.target.classList.add('focus:outline-indigo-700');
  } else if (nameValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  console.log("validamos name");
  validateForm();
});
  
emailInput.addEventListener('input', e => {
  const emailValidation = EMAIL_VALIDATION.test(e.target.value);
  e.target.classList.remove('outline-red-700', 'outline-green-700');
  if (e.target.value === '') {
    e.target.classList.add('focus:outline-indigo-700');
  } else if (emailValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  console.log("validamos email");
  validateForm();
});

passwordInput.addEventListener('input', e => {
  const passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
  e.target.classList.remove('outline-red-700', 'outline-green-700');
  if (e.target.value === '') {
    e.target.classList.add('focus:outline-indigo-700');
  } else if (passwordValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  // También actualiza el match en tiempo real
  console.log("validamos password");
  
  matchValidation = e.target.value === matchInput.value;
  validation(matchInput, matchValidation);
  validateForm();
});
  
matchInput.addEventListener('input', e => {
    matchValidation = e.target.value === passwordInput.value ;
  console.log("validamos match");
    validation(matchInput, matchValidation)
   });

   form.addEventListener('submit', async e =>{
    e.preventDefault();
    try {
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        }

        const {data} = await axios.post(`${PAGE_URL}/api/User`, newUser);
        
        console.log(data.message); 
        createNotification(false, data.message); 

        setTimeout(()=>{
            notification.innerHTML = ''
        },5000)

        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        matchInput.value = '';
        console.log("validamos boton");

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

