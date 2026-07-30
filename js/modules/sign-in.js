import membersService from '../api/services/members.js';
import statesService from '../api/services/states.js';
import universitiesService from '../api/services/universities.js';
import countryService from '../api/services/country.js';

const togglePassword = document.getElementById("toggle-password")
const password = document.getElementById("password")

const confirmPassword = document.getElementById("confirm-password");
const confirmPasswordInfo = document.getElementById("confirm-password-info");
const emailField = document.getElementById("email");

emailField.addEventListener('input', () => {
    emailField.classList.remove('field-error');
});

// Permitir ver contraseña de manera opcional
togglePassword.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

const universities = await universitiesService.get();
const countries = await countryService.get();
const states = await statesService.get();

const universidadSelect = document.getElementById("universidad-select");
const paisSelect = document.getElementById("pais-select");
const estadoSelect = document.getElementById("estado-select");

// Colocar las universidades en el select
universities.forEach(universidad => {
    const option = document.createElement("option");
    option.value = universidad.id;
    option.textContent = universidad.name;
    universidadSelect.appendChild(option);
});

// Colocar los países en el select
countries.forEach(pais => {
    const option = document.createElement("option");
    option.value = pais.id;
    option.textContent = pais.name;
    paisSelect.appendChild(option);
});

// Carga dinámica de estado según el país seleccionado
paisSelect.onchange = async(e) =>{
    const country = e.target.value;        
    estadoSelect.innerHTML = '<option value="" selected disabled>Selecciona tu estado</option>';
    const relatedStates = states.filter(state => state.countryId == country);
    // Colocar los estados en el select
    relatedStates.forEach(state => {
        const option = document.createElement("option");
        option.value = state.id;
        option.textContent = state.name;
        estadoSelect.appendChild(option);
    });
}

confirmPassword.onkeyup = (e) => {
    const pass = e.target.value;

    if(pass) {
        if (pass !== password.value) {
            confirmPasswordInfo.textContent = "Las contraseñas NO coinciden";
            confirmPasswordInfo.classList.remove('correct-password')
            confirmPasswordInfo.classList.add('incorrect-password')
        } else {
            confirmPasswordInfo.textContent = "Las contraseñas COINCIDEN";
            confirmPasswordInfo.classList.remove('incorrect-password')
            confirmPasswordInfo.classList.add('correct-password')
        }
    } else {
        confirmPasswordInfo.classList.remove('correct-password')
        confirmPasswordInfo.classList.remove('incorrect-password')
        confirmPasswordInfo.textContent = "";
    } 
}




document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();      

    const nombreField = document.getElementById("nombre");
    const apellidosField = document.getElementById("apellidos");
    const generoField = document.getElementById("genero");
    const passwordField = document.getElementById("password");

    const universidadId = universidadSelect.value;
    const paisId = paisSelect.value;  
    const estadoId = estadoSelect.value;

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nameRegex.test(nombreField.value.trim())) {
        alert("El nombre solo debe contener letras y espacios.");
        return;
    }
    if (!nameRegex.test(apellidosField.value.trim())) {
        alert("Los apellidos solo deben contener letras y espacios.");
        return;
    }
    if (!generoField.value) {
        alert("Por favor selecciona tu género.");
        return;
    }
    if (!emailRegex.test(emailField.value.trim())) {
        alert("Ingresa un correo electrónico válido.");
        return;
    }
    if (!strongPasswordRegex.test(passwordField.value)) {
        alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
        return;
    }
    if (!universidadId || !paisId || !estadoId) {
        alert("Por favor selecciona universidad, país y estado.");
        return;
    }
    if (passwordField.value !== confirmPassword.value) {
        alert("Las contraseñas no coinciden.");
        return; // ← detiene el envío
    }

    try {                
        // Crear objeto con los datos del miembro
        const memberData = {
            nombre: nombreField.value.trim(),
            apellidos: apellidosField.value.trim(),
            genero: generoField.value,
            email: emailField.value.trim(),
            password: passwordField.value,  
            universidad: universidadId,
            paises: paisId,
            estado: estadoId
        };

        // Enviar datos al servidor
        const response = await membersService.addMember(memberData);
        
        // Mostrar mensaje de éxito
        alert('Cuenta creada exitosamente!');
        
        // Limpiar el formulario
        this.reset();
        
        // Redirigir a verificación con el email como parámetro
        window.location.href = `verificacion_mail.html?email=${encodeURIComponent(memberData.email)}`;
    } catch (error) {
        console.error('Error al crear la cuenta:', error);

        // El backend responde 409 cuando el email ya está registrado
        if (error?.status === 409) {
            alert(error?.data?.error || 'Ya existe una cuenta registrada con este correo electrónico.');
            emailField.classList.add('field-error');
            emailField.focus();
            return;
        }

        alert('Ocurrió un error al crear la cuenta. Por favor intenta nuevamente.');
    }
});