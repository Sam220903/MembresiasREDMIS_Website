import statisticsService from '../api/services/statistics.js'


document.addEventListener('DOMContentLoaded', async() => {

    const statistics = await statisticsService.get();

    console.log(statistics);

    // Selección de páneles
    const panelSelector = document.getElementById('statistics-selector');

    panelSelector.value = 'members-panel';
    panelSelector.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        
        const panels = document.querySelectorAll('.statistics-panel');
        panels.forEach(panel => {
            if (panel.id === selectedValue) {
                panel.style.display = 'flex';
            } else {
                panel.style.display = 'none';
            }
        }); 
    });


    // Contenido de panel de solicitudes / membresías

    const applicationsPanel = document.getElementById('applications-panel');
    
    const approvedData = applicationsPanel.querySelector('#total-approved');
    const rejectedData = applicationsPanel.querySelector('#total-rejected');
    const pendingData = applicationsPanel.querySelector('#total-pending');

    approvedData.textContent = statistics.applications.APROBADA;
    rejectedData.textContent = statistics.applications.RECHAZADA;
    pendingData.textContent = statistics.applications.PENDIENTE;

    const inactiveData = applicationsPanel.querySelector('#total-inactive');
    const activeData = applicationsPanel.querySelector('#total-active');
        
    inactiveData.textContent = statistics.memberships.INACTIVA;
    activeData.textContent = statistics.memberships.ACTIVA;

    // Contenido de panel de conteo total
    const totalApplicationsData = document.getElementById('total-applications-value');
    const totalMembershipsData = document.getElementById('total-memberships-value');

    let totalApplications = 0;
    for (const status in statistics.applications) {
        totalApplications += statistics.applications[status];
    }
    totalApplicationsData.textContent = totalApplications;

    let totalMemberships = 0;
    for (const status in statistics.memberships) {
        totalMemberships += statistics.memberships[status];
    }
    totalMembershipsData.textContent = totalMemberships;


    // Contenido de panel de distribución de miembros
    await createCountryDistributionChart(statistics.members_per_country);
    
    
})

const createCountryDistributionChart = async (data) => {
    const labels = Object.keys(data);   // ["México", "Estados Unidos", "España", "Argentina"]
    const values = Object.values(data); // [2, 1, 1, 1]

    const ctx = document.getElementById('members-per-country-chart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Miembros por país',
                data: values,
                backgroundColor: '#1D4ED8',
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1  // Para que solo muestre números enteros
                    }
                }
            }
        }
    });

}
