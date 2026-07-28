// Calcula el prefijo según la profundidad de la ruta actual
const getBasePath = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const rootIndex = parts.indexOf('pages');
    const endsWithSlash = window.location.pathname.endsWith('/');
    const depth = parts.length - rootIndex - 1 + (endsWithSlash ? 1 : 0);
    return '../'.repeat(depth);
}

const basePath = getBasePath();

const admin_registration = document.getElementById('admin-register');
admin_registration.addEventListener('click', () => {
    window.location.href = `${basePath}pages/management/admin_registration.html`;
});

const manageMembers = document.getElementById('manage-members');
manageMembers.addEventListener('click', () => {
    window.location.href = `${basePath}pages/management/members.html`
})

const addEntities = document.getElementById('add-entities');
addEntities.addEventListener('click', () => {
    window.location.href =  `${basePath}pages/management/addEntities.html`;
});

const addMembership = document.getElementById('add-membership');
addMembership.addEventListener('click', () => {
    window.location.href = `${basePath}pages/management/membership-type.html`;
})

const addInvestigationLine = document.getElementById('add-investigation-line');
addInvestigationLine.addEventListener('click', () => {
    window.location.href = `${basePath}pages/management/investigation-lines.html`;  
})