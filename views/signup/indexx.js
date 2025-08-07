console.log('validamos el formulario de registro');

const form = document.querySelector('#form');
const nameInput = document.querySelector('#name-input');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const matchInput = document.querySelector('#match-input');
const formBtn = document.querySelector('#form-btn');


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
  
  if (e.target.value === '') {
    e.target.classList.remove('outline-red-700', 'outline-green-700');
    e.target.classList.add('focus:outline-indigo-700');
  } else if (nameValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  
  validateForm();
});

emailInput.addEventListener('input', e => {
  const emailValidation = EMAIL_VALIDATION.test(e.target.value);
  
  if (e.target.value === '') {
    e.target.classList.remove('outline-red-700', 'outline-green-700');
    e.target.classList.add('focus:outline-indigo-700');
  } else if (emailValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  
  validateForm();
});

passwordInput.addEventListener('input', e => {
  const passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
  const isMatchValid = e.target.value === matchInput.value && e.target.value !== '';
  
  if (e.target.value === '') {
    e.target.classList.remove('outline-red-700', 'outline-green-700');
    e.target.classList.add('focus:outline-indigo-700');
    matchInput.classList.remove('outline-red-700', 'outline-green-700');
    matchInput.classList.add('focus:outline-indigo-700');
  } else if (passwordValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
    
    // Validar match también
    if (isMatchValid) {
      matchInput.classList.remove('focus:outline-indigo-700', 'outline-red-700');
      matchInput.classList.add('outline-green-700');
    } else {
      matchInput.classList.remove('focus:outline-indigo-700', 'outline-green-700');
      matchInput.classList.add('outline-red-700');
    }
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  
  validateForm();
});

matchInput.addEventListener('input', e => {
  const isMatchValid = e.target.value === passwordInput.value && passwordInput.value !== '';
  
  if (e.target.value === '') {
    e.target.classList.remove('outline-red-700', 'outline-green-700');
    e.target.classList.add('focus:outline-indigo-700');
  } else if (isMatchValid) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
  }
  
  validateForm();
});

// Evento para enviar el formulario
form.addEventListener('submit', async e => {
   e.preventDefault();
    try{
        const newUser = {
        nombre: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
        }
        const response = await axios.post('/api/users', newUser);
        console.log(response);
    }catch(error){
        console.log(error);
    }

});