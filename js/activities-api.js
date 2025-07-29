// API para gestão de atividades
const API_BASE_URL = 'https://associaval-backend.onrender.com';

// Função para fazer requisições à API
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao fazer requisição à API:', error);
        return null;
    }
}

// Função para carregar todas as atividades
async function loadAllActivities() {
    const data = await fetchAPI('/api/activities');
    if (!data || !data.activities) {
        console.error('Não foi possível carregar as atividades');
        return;
    }

    const activitiesContainer = document.querySelector('.activities-list');
    if (!activitiesContainer) return;

    // Limpar conteúdo existente
    activitiesContainer.innerHTML = '';

    if (data.activities.length === 0) {
        activitiesContainer.innerHTML = `
            <div class="no-activities">
                <p>Ainda não há atividades registadas.</p>
                <p>As associações podem adicionar as suas atividades através do sistema de gestão.</p>
            </div>
        `;
        return;
    }

    // Ordenar atividades por data (mais recentes primeiro)
    const sortedActivities = data.activities.sort((a, b) => {
        // Formato ISO YYYY-MM-DD
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    sortedActivities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.setAttribute('data-association', activity.association_name || '');
        activityCard.setAttribute('data-date', activity.date);
        
        // Formatar a data para exibição
        let formattedDate = 'Data não disponível';
        if (activity.date) {
            const date = new Date(activity.date);
            if (!isNaN(date)) {
                formattedDate = date.toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        }
        
        activityCard.innerHTML = `
            <div class="activity-header">
                <h3 class="activity-title">${activity.name}</h3>
                <span class="activity-date">${formattedDate}</span>
            </div>
            <div class="activity-content">
                <p class="activity-description">${activity.description}</p>
                <div class="activity-details">
                    <p class="activity-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${activity.location}
                    </p>
                    <p class="activity-association">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        ${activity.association_name || 'Associação não especificada'}
                    </p>
                </div>
            </div>
        `;
        
        activitiesContainer.appendChild(activityCard);
    });

    // Aplicar filtros se existirem parâmetros na URL
    applyURLFilters();
}

// Função para aplicar filtros baseados nos parâmetros da URL
function applyURLFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const freguesia = urlParams.get('freguesia');
    const atividade = urlParams.get('atividade');

    if (freguesia) {
        const freguesiaSelect = document.querySelector('#filter-freguesia');
        if (freguesiaSelect) {
            freguesiaSelect.value = freguesia;
            filterActivities();
        }
    }

    if (atividade) {
        const atividadeSelect = document.querySelector('#filter-atividade');
        if (atividadeSelect) {
            atividadeSelect.value = atividade;
            filterActivities();
        }
    }
}

// Função para filtrar atividades
function filterActivities() {
    const freguesiaFilter = document.querySelector('#filter-freguesia')?.value || '';
    const atividadeFilter = document.querySelector('#filter-atividade')?.value || '';
    const dataFilter = document.querySelector('#filter-data')?.value || '';
    const searchTerm = document.querySelector('#search-activities')?.value.toLowerCase() || '';

    const activityCards = document.querySelectorAll('.activity-card');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar para início do dia

    activityCards.forEach(card => {
        let showCard = true;

        // Filtro por freguesia (baseado na localização da atividade)
        if (freguesiaFilter) {
            const location = card.querySelector('.activity-location')?.textContent.toLowerCase() || '';
            if (!location.includes(freguesiaFilter.toLowerCase())) {
                showCard = false;
            }
        }

        // Filtro por tipo de atividade (baseado no nome ou descrição)
        if (atividadeFilter) {
            const title = card.querySelector('.activity-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.activity-description')?.textContent.toLowerCase() || '';
            if (!title.includes(atividadeFilter.toLowerCase()) && !description.includes(atividadeFilter.toLowerCase())) {
                showCard = false;
            }
        }

        // Filtro por data
        if (dataFilter) {
            const dateStr = card.getAttribute('data-date');
            if (dateStr) {
                const activityDate = new Date(dateStr);
                activityDate.setHours(0, 0, 0, 0); // Normalizar para início do dia
                
                const oneDay = 24 * 60 * 60 * 1000; // milissegundos em um dia
                const daysDiff = Math.round((activityDate - today) / oneDay);
                
                if (dataFilter === 'hoje' && daysDiff !== 0) {
                    showCard = false;
                } else if (dataFilter === 'semana' && (daysDiff < 0 || daysDiff > 7)) {
                    showCard = false;
                } else if (dataFilter === 'mes' && (daysDiff < 0 || daysDiff > 30)) {
                    showCard = false;
                } else if (dataFilter === 'proximo-mes' && (daysDiff < 30 || daysDiff > 60)) {
                    showCard = false;
                } else if (dataFilter === 'passadas' && daysDiff >= 0) {
                    showCard = false;
                } else if (dataFilter === 'futuras' && daysDiff < 0) {
                    showCard = false;
                }
            } else {
                // Se não tiver data, não mostrar quando filtrar por data
                showCard = false;
            }
        }

        // Filtro por pesquisa
        if (searchTerm) {
            const title = card.querySelector('.activity-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.activity-description')?.textContent.toLowerCase() || '';
            const association = card.querySelector('.activity-association')?.textContent.toLowerCase() || '';
            
            if (!title.includes(searchTerm) && !description.includes(searchTerm) && !association.includes(searchTerm)) {
                showCard = false;
            }
        }

        card.style.display = showCard ? 'block' : 'none';
    });

    // Mostrar mensagem se nenhuma atividade for encontrada
    const visibleCards = document.querySelectorAll('.activity-card[style="display: block"], .activity-card:not([style*="display: none"])');
    const activitiesContainer = document.querySelector('.activities-list');
    
    let noResultsMessage = document.querySelector('.no-results-message');
    if (visibleCards.length === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <p>Nenhuma atividade encontrada com os filtros aplicados.</p>
                <p>Tente ajustar os filtros ou limpar a pesquisa.</p>
            `;
            activitiesContainer.appendChild(noResultsMessage);
        }
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    loadAllActivities();

    // Adicionar event listeners para filtros
    const freguesiaFilter = document.querySelector('#filter-freguesia');
    const atividadeFilter = document.querySelector('#filter-atividade');
    const dataFilter = document.querySelector('#filter-data');
    const searchInput = document.querySelector('#search-activities');
    const applyFiltersBtn = document.querySelector('#apply-filters');
    const clearFiltersBtn = document.querySelector('#clear-filters');

    if (freguesiaFilter) {
        freguesiaFilter.addEventListener('change', filterActivities);
    }

    if (atividadeFilter) {
        atividadeFilter.addEventListener('change', filterActivities);
    }

    if (dataFilter) {
        dataFilter.addEventListener('change', filterActivities);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterActivities);
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterActivities);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (freguesiaFilter) freguesiaFilter.value = '';
            if (atividadeFilter) atividadeFilter.value = '';
            if (dataFilter) dataFilter.value = '';
            if (searchInput) searchInput.value = '';
            filterActivities();
        });
    }
});

