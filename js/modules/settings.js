const loadCountryModal = () => {
    let countryModalPath = '../partials/addCountry.html';
    const modalContainer = document.getElementById('addCountryModal');

    fetch(countryModalPath)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            const acceptBtn = document.getElementById('acceptBtn');
            acceptBtn.addEventListener('click', () => {
                const paisInput = document.getElementById('pais');
                const pais = paisInput.value.trim();
                if (pais) {
                    console.log('País ingresado:', pais);
                    closeCountryModal();
                } else {
                    alert('Por favor, ingresa un país válido.');
                }
            });

            const closeCountryBtn = document.getElementById('close-country-btn');
            closeCountryBtn.addEventListener('click', closeCountryModal);
        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });

}

const openCountryModal = () => {
    const modal = document.getElementById('add-country-modal-form');
    modal.style.display = 'block';
}

const closeCountryModal = () => {
    const modal = document.getElementById('add-country-modal-form');
    modal.style.display = 'none';
}




const loadStateModal = () => {
    let stateModalPath = '../partials/addState.html';
    const modalContainer = document.getElementById('addStateModal');

    fetch(stateModalPath)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            const acceptBtn = document.getElementById('acceptBtn');
            acceptBtn.addEventListener('click', () => {
                const estadoInput = document.getElementById('estado');
                const estado = estadoInput.value.trim();
                if (estado) {
                    console.log('Estado ingresado:', estado);
                    closeStateModal();
                } else {
                    alert('Por favor, ingresa un estado válido.');
                }
            });

            const closeStateBtn = document.getElementById('close-state-btn');
            closeStateBtn.addEventListener('click', closeStateModal);
        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });

}

const openStateModal = () => {
    const modal = document.getElementById('add-state-modal-form');
    modal.style.display = 'block';
}

const closeStateModal = () => {
    const modal = document.getElementById('add-state-modal-form');
    modal.style.display = 'none';
}



const loadUniversityModal = () => {
    let universityModalPath = '../partials/addUniversity.html';
    const modalContainer = document.getElementById('addUniversityModal');

    fetch(universityModalPath)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            const acceptBtn = document.getElementById('acceptBtn');
            acceptBtn.addEventListener('click', () => {
                const universidadInput = document.getElementById('universidad');
                const universidad = universidadInput.value.trim();
                if (universidad) {
                    console.log('Universidad ingresada:', universidad);
                    closeUniversityModal();
                } else {
                    alert('Por favor, ingresa una universidad válida.');
                }
            });

            const closeUniversityBtn = document.getElementById('close-university-btn');
            closeUniversityBtn.addEventListener('click', closeUniversityModal);
        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });

}

const openUniversityModal = () => {
    const modal = document.getElementById('add-university-modal-form');
    modal.style.display = 'block';
}

const closeUniversityModal = () => {
    const modal = document.getElementById('add-university-modal-form');
    modal.style.display = 'none';
}

loadCountryModal();
loadStateModal();
loadUniversityModal();


const openAddCountryBtn = document.getElementById('add-country-btn');
openAddCountryBtn.addEventListener('click', openCountryModal);

const openAddStateBtn = document.getElementById('add-state-btn');
openAddStateBtn.addEventListener('click', openStateModal);

const openAddUniversityBtn = document.getElementById('add-university-btn');
openAddUniversityBtn.addEventListener('click', openUniversityModal);






