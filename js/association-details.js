// Configuração da API para página de detalhes da associação
const API_BASE_URL = 'https://associaval-backend.onrender.com';

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        return null;
    }
}

// Obter ID da associação da URL
function getAssociationIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Carregar detalhes da associação
async function loadAssociationDetails() {
    const associationId = getAssociationIdFromURL();
    if (!associationId) {
        document.getElementById('association-content').innerHTML = '<p class="error">ID da associação não encontrado.</p>';
        return;
    }
    
    const association = await apiRequest(`/api/associations/${associationId}`);
    if (!association) {
        document.getElementById('association-content').innerHTML = '<p class="error">Erro ao carregar detalhes da associação.</p>';
        return;
    }
    
    renderAssociationDetails(association);
    loadAssociationActivities(associationId);
}

// Renderizar detalhes da associação
function renderAssociationDetails(association) {
    const container = document.getElementById('association-content');
    const breadcrumb = document.getElementById('association-name-breadcrumb');
    
    if (breadcrumb) {
        breadcrumb.textContent = association.name;
    }
    
    container.innerHTML = `
        <div class="association-detail-card">
            <div class="association-header">
                <h1 class="association-title">${association.name}</h1>
                <span class="association-type-badge">${getActivityTypeLabel(association.activity_type)}</span>
            </div>
            
            <div class="association-info-grid">
                <div class="association-main-info">
                    <h2>Sobre a Associação</h2>
                    <p class="association-description">${association.description || 'Descrição não disponível'}</p>
                    
                    <div class="association-contact">
                        <h3>Contactos</h3>
                        <div class="contact-item">
                            <strong>📍 Morada:</strong>
                            <span>${association.address}</span>
                        </div>
                        ${association.phone ? `
                            <div class="contact-item">
                                <strong>📞 Telefone:</strong>
                                <span>${association.phone}</span>
                            </div>
                        ` : ''}
                        ${association.email ? `
                            <div class="contact-item">
                                <strong>✉️ Email:</strong>
                                <span><a href="mailto:${association.email}">${association.email}</a></span>
                            </div>
                        ` : ''}
                        ${association.social_media ? `
                            <div class="contact-item">
                                <strong>🌐 Redes Sociais:</strong>
                                <span>${association.social_media}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="association-sidebar">
                    <div class="quick-actions">
                        <h3>Ações Rápidas</h3>
                        <button class="btn btn-primary btn-block" onclick="viewAllActivities(${association.id})">
                            Ver Todas as Atividades
                        </button>
                        ${association.email ? `
                            <button class="btn btn-outline btn-block" onclick="contactAssociation('${association.email}')">
                                Contactar Associação
                            </button>
                        ` : ''}
                        <button class="btn btn-outline btn-block" onclick="shareAssociation('${association.name}')">
                            Partilhar Associação
                        </button>
                    </div>
                    
                    <div class="association-stats">
                        <h3>Estatísticas</h3>
                        <div class="stat-item">
                            <span class="stat-label">Atividades Ativas:</span>
                            <span class="stat-value" id="activities-count">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Próxima Atividade:</span>
                            <span class="stat-value" id="next-activity">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Carregar atividades da associação
async function loadAssociationActivities(associationId) {
    const activities = await apiRequest(`/api/associations/${associationId}/activities`);
    if (!activities) {
        document.getElementById('activities-content').innerHTML = '<p class="error">Erro ao carregar atividades.</p>';
        return;
    }
    
    renderAssociationActivities(activities);
    updateAssociationStats(activities);
}

// Renderizar atividades da associação
function renderAssociationActivities(activities) {
    const container = document.getElementById('activities-content');
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="no-results">Esta associação ainda não tem atividades registadas.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="activities-grid">
            ${activities.map(activity => `
                <div class="activity-card">
                    <div class="activity-header">
                        <h3 class="activity-name">${activity.name}</h3>
                        <span class="activity-date">${formatDate(activity.date)}</span>
                    </div>
                    <div class="activity-content">
                        <p class="activity-description">${activity.description || 'Descrição não disponível'}</p>
                        ${activity.location ? `<p class="activity-location">📍 ${activity.location}</p>` : ''}
                    </div>
                    <div class="activity-actions">
                        <button class="btn btn-primary btn-sm" onclick="viewActivityDetails(${activity.id})">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Atualizar estatísticas da associação
function updateAssociationStats(activities) {
    const activitiesCount = document.getElementById('activities-count');
    const nextActivity = document.getElementById('next-activity');
    
    if (activitiesCount) {
        activitiesCount.textContent = activities.length;
    }
    
    if (nextActivity) {
        const futureActivities = activities.filter(activity => new Date(activity.date) > new Date());
        if (futureActivities.length > 0) {
            const next = futureActivities.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
            nextActivity.textContent = formatDate(next.date);
        } else {
            nextActivity.textContent = 'Nenhuma';
        }
    }
}

// Função para obter label do tipo de atividade
function getActivityTypeLabel(type) {
    const types = {
        'cultura': 'Cultura',
        'desporto': 'Desporto',
        'educacao': 'Educação',
        'social': 'Social',
        'recreativo': 'Recreativo',
        'religioso': 'Religioso'
    };
    return types[type] || 'Geral';
}

// Formatar data
function formatDate(dateString) {
    if (!dateString) return 'Data não definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Ações rápidas
function viewAllActivities(associationId) {
    window.location.href = `atividades.html?associacao=${associationId}`;
}

function contactAssociation(email) {
    window.location.href = `mailto:${email}`;
}

function shareAssociation(name) {
    if (navigator.share) {
        navigator.share({
            title: `${name} - AssociaVal`,
            text: `Conheça a associação ${name} no AssociaVal`,
            url: window.location.href
        });
    } else {
        // Fallback para browsers que não suportam Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

function viewActivityDetails(activityId) {
    window.location.href = `atividade-detalhes.html?id=${activityId}`;
}

// Inicializar página de detalhes da associação
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('associacao-detalhes.html')) {
        loadAssociationDetails();
    }
});

