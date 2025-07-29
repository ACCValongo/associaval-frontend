// Configuração da API
const API_BASE_URL = 'https://associaval-backend.onrender.com';

// Função para carregar associações
async function loadAssociations() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/associations`);
        const data = await response.json();
        
        const container = document.getElementById('associations-container');
        if (!container) return;
        
        if (data.associations && data.associations.length > 0) {
            // Mostrar apenas as primeiras 4 associações em destaque
            const featuredAssociations = data.associations.slice(0, 4);
            
            container.innerHTML = featuredAssociations.map(association => `
                <article class="card association-card">
                    <div class="card-body">
                        <h3 class="association-name">${association.name}</h3>
                        <p class="association-description">
                            ${association.description || 'Associação ativa no concelho de Valongo.'}
                        </p>
                        <a href="pages/associacao-detalhes.html?id=${association.id}" class="btn btn-outline btn-sm">
                            Saber Mais
                        </a>
                    </div>
                </article>
            `).join('');
        } else {
            container.innerHTML = `
                <article class="card association-card">
                    <div class="card-body">
                        <h3 class="association-name">Grupo Folclórico de Valongo</h3>
                        <p class="association-description">
                            Preservação e divulgação das tradições populares do concelho através da dança e música tradicional.
                        </p>
                        <a href="pages/associacoes/grupo-folclorico-valongo.html" class="btn btn-outline btn-sm">
                            Saber Mais
                        </a>
                    </div>
                </article>
                <article class="card association-card">
                    <div class="card-body">
                        <h3 class="association-name">Clube Desportivo de Ermesinde</h3>
                        <p class="association-description">
                            Promoção do desporto e atividade física para todas as idades, com especial foco no futebol e basquetebol.
                        </p>
                        <a href="pages/associacoes/clube-desportivo-ermesinde.html" class="btn btn-outline btn-sm">
                            Saber Mais
                        </a>
                    </div>
                </article>
                <article class="card association-card">
                    <div class="card-body">
                        <h3 class="association-name">Universidade Sénior de Alfena</h3>
                        <p class="association-description">
                            Educação e formação para a população sénior, promovendo o envelhecimento ativo e a aprendizagem ao longo da vida.
                        </p>
                        <a href="pages/associacoes/universidade-senior-alfena.html" class="btn btn-outline btn-sm">
                            Saber Mais
                        </a>
                    </div>
                </article>
                <article class="card association-card">
                    <div class="card-body">
                        <h3 class="association-name">Associação Cultural de Campo</h3>
                        <p class="association-description">
                            Dinamização cultural da freguesia através de teatro, música e eventos comunitários.
                        </p>
                        <a href="pages/associacoes/associacao-cultural-campo.html" class="btn btn-outline btn-sm">
                            Saber Mais
                        </a>
                    </div>
                </article>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar associações:', error);
        const container = document.getElementById('associations-container');
        if (container) {
            container.innerHTML = '<div class="error-message">Erro ao carregar associações. Tente novamente mais tarde.</div>';
        }
    }
}

// Função para carregar atividades
async function loadActivities() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/activities`);
        const data = await response.json();
        
        const container = document.getElementById('activities-container');
        if (!container) return;
        
        if (data.activities && data.activities.length > 0) {
            // Mostrar apenas as primeiras 4 atividades em destaque
            const featuredActivities = data.activities.slice(0, 4);
            
            container.innerHTML = featuredActivities.map(activity => {
                // Extrair dia e mês da data
                const dateObj = new Date(activity.date);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = dateObj.toLocaleDateString('pt-PT', { month: 'short' }).toUpperCase();
                
                // Determinar tipo de atividade para estilo
                const activityType = activity.activity_type || 'outro';
                const typeClass = `activity-${activityType}`;
                
                return `
                    <article class="card activity-card ${typeClass}">
                        <div class="card-header">
                            <div class="activity-date">
                                <span class="date-day">${day}</span>
                                <span class="date-month">${month}</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <h3 class="activity-name">${activity.name}</h3>
                            <p class="activity-description">
                                ${activity.description}
                            </p>
                            <div class="activity-meta">
                                <span class="activity-location">${activity.location}</span>
                                <span class="activity-association">${activity.association_name}</span>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');
        } else {
            container.innerHTML = `
                <article class="card activity-card">
                    <div class="card-header">
                        <div class="activity-date">
                            <span class="date-day">15</span>
                            <span class="date-month">DEZ</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="activity-name">Concerto de Natal</h3>
                        <p class="activity-description">
                            Concerto de música tradicional natalícia pelo Coro de Valongo no Auditório Municipal.
                        </p>
                        <div class="activity-meta">
                            <span class="activity-location">Auditório Municipal</span>
                            <span class="activity-time">21:00</span>
                        </div>
                    </div>
                </article>
                <article class="card activity-card">
                    <div class="card-header">
                        <div class="activity-date">
                            <span class="date-day">18</span>
                            <span class="date-month">DEZ</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="activity-name">Torneio de Karaté</h3>
                        <p class="activity-description">
                            Competição regional de karaté com participação de várias escolas do distrito.
                        </p>
                        <div class="activity-meta">
                            <span class="activity-location">Pavilhão de Ermesinde</span>
                            <span class="activity-time">14:00</span>
                        </div>
                    </div>
                </article>
                <article class="card activity-card">
                    <div class="card-header">
                        <div class="activity-date">
                            <span class="date-day">22</span>
                            <span class="date-month">DEZ</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="activity-name">Peça de Teatro</h3>
                        <p class="activity-description">
                            "O Auto da Barca do Inferno" pelo Grupo de Teatro de Sobrado.
                        </p>
                        <div class="activity-meta">
                            <span class="activity-location">Centro Cultural</span>
                            <span class="activity-time">20:30</span>
                        </div>
                    </div>
                </article>
                <article class="card activity-card">
                    <div class="card-header">
                        <div class="activity-date">
                            <span class="date-day">28</span>
                            <span class="date-month">DEZ</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="activity-name">Baile de Fim de Ano</h3>
                        <p class="activity-description">
                            Celebração de fim de ano com música ao vivo e animação para toda a família.
                        </p>
                        <div class="activity-meta">
                            <span class="activity-location">Salão Paroquial</span>
                            <span class="activity-time">22:00</span>
                        </div>
                    </div>
                </article>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        const container = document.getElementById('activities-container');
        if (container) {
            container.innerHTML = '<div class="error-message">Erro ao carregar atividades. Tente novamente mais tarde.</div>';
        }
    }
}

// Função para carregar calendário com atividades
async function loadCalendar() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/activities`);
        const data = await response.json();
        
        // Integrar atividades no calendário existente
        if (data.activities && data.activities.length > 0) {
            // Adicionar eventos ao calendário
            window.calendarEvents = data.activities.map(activity => ({
                date: activity.date,
                name: activity.name,
                type: activity.activity_type || 'outro',
                location: activity.location
            }));
        }
        
        // Inicializar calendário (se a função existir)
        if (typeof initializeCalendar === 'function') {
            initializeCalendar();
        }
    } catch (error) {
        console.error('Erro ao carregar calendário:', error);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    loadAssociations();
    loadActivities();
    loadCalendar();
});

