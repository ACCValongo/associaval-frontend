// Calendário integrado com as atividades do backend
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
});

// Inicializar o calendário
function initCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarTitle = document.getElementById('calendar-title');
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (!calendarGrid || !calendarTitle) return;
    
    let currentDate = new Date();
    let events = {};
    
    // Carregar eventos do backend
    async function loadEvents() {
        try {
            const API_BASE_URL = 'https://associaval-backend.onrender.com';
            const response = await fetch(`${API_BASE_URL}/api/activities`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Converter atividades para o formato de eventos do calendário
            events = {};
            if (data && data.activities && data.activities.length > 0) {
                data.activities.forEach(activity => {
                    if (activity.date) {
                        const dateKey = activity.date.split('T')[0]; // Formato ISO YYYY-MM-DD
                        
                        // Determinar o tipo de evento
                        let type = 'culture'; // Padrão
                        const activityName = activity.name.toLowerCase();
                        const activityType = activity.activity_type ? activity.activity_type.toLowerCase() : '';
                        
                        if (activityName.includes('música') || activityName.includes('concerto') || 
                            activityName.includes('canto') || activityType.includes('música')) {
                            type = 'music';
                        } else if (activityName.includes('teatro') || activityName.includes('peça') || 
                                  activityType.includes('teatro')) {
                            type = 'theater';
                        } else if (activityName.includes('futebol') || activityName.includes('karaté') || 
                                  activityName.includes('desporto') || activityType.includes('desporto')) {
                            type = 'sport';
                        }
                        
                        if (!events[dateKey]) {
                            events[dateKey] = [];
                        }
                        
                        events[dateKey].push({
                            name: activity.name,
                            type: type,
                            id: activity.id
                        });
                    }
                });
            }
            
            // Adicionar eventos de exemplo se não houver eventos reais
            if (Object.keys(events).length === 0) {
                events = {
                    '2024-12-15': [{ name: 'Concerto de Natal', type: 'music' }],
                    '2024-12-18': [{ name: 'Torneio de Karaté', type: 'sport' }],
                    '2024-12-22': [{ name: 'Peça de Teatro', type: 'theater' }],
                    '2024-12-28': [{ name: 'Baile de Fim de Ano', type: 'culture' }],
                    '2025-01-05': [{ name: 'Aula de Dança', type: 'culture' }],
                    '2025-01-12': [{ name: 'Jogo de Futebol', type: 'sport' }],
                    '2025-01-19': [{ name: 'Concerto de Fado', type: 'music' }],
                    '2025-01-26': [{ name: 'Workshop de Teatro', type: 'theater' }]
                };
            }
            
            // Renderizar o calendário com os eventos
            renderCalendar(currentDate);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            // Usar eventos de exemplo em caso de erro
            events = {
                '2024-12-15': [{ name: 'Concerto de Natal', type: 'music' }],
                '2024-12-18': [{ name: 'Torneio de Karaté', type: 'sport' }],
                '2024-12-22': [{ name: 'Peça de Teatro', type: 'theater' }],
                '2024-12-28': [{ name: 'Baile de Fim de Ano', type: 'culture' }],
                '2025-01-05': [{ name: 'Aula de Dança', type: 'culture' }],
                '2025-01-12': [{ name: 'Jogo de Futebol', type: 'sport' }],
                '2025-01-19': [{ name: 'Concerto de Fado', type: 'music' }],
                '2025-01-26': [{ name: 'Workshop de Teatro', type: 'theater' }]
            };
            renderCalendar(currentDate);
        }
    }
    
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Atualizar título
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        calendarTitle.textContent = `${monthNames[month]} ${year}`;
        
        // Limpar calendário
        calendarGrid.innerHTML = '';
        
        // Adicionar cabeçalhos dos dias da semana
        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Primeiro dia do mês e último dia do mês anterior
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Gerar dias do calendário
        const today = new Date();
        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Verificar se é do mês atual
            if (currentDay.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            // Verificar se é hoje
            if (currentDay.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Número do dia
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = currentDay.getDate();
            dayElement.appendChild(dayNumber);
            
            // Verificar eventos
            const dateKey = currentDay.toISOString().split('T')[0];
            if (events[dateKey]) {
                dayElement.classList.add('has-event');
                events[dateKey].forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.className = `calendar-event ${event.type}`;
                    eventElement.textContent = event.name;
                    eventElement.title = event.name;
                    dayElement.appendChild(eventElement);
                });
            }
            
            // Adicionar evento de clique
            dayElement.addEventListener('click', () => {
                if (events[dateKey]) {
                    showEventDetails(currentDay, events[dateKey]);
                }
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function showEventDetails(date, dayEvents) {
        const dateStr = date.toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let eventsList = dayEvents.map(event => `• ${event.name}`).join('\n');
        
        // Filtrar atividades por data
        const dataFilter = document.querySelector('#filter-data');
        if (dataFilter) {
            // Definir o filtro para a data selecionada
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
            
            // Aplicar filtro personalizado para esta data específica
            const activityCards = document.querySelectorAll('.activity-card');
            
            activityCards.forEach(card => {
                const cardDate = card.getAttribute('data-date');
                card.style.display = (cardDate === formattedDate) ? 'block' : 'none';
            });
            
            // Mostrar mensagem se nenhuma atividade for encontrada
            const visibleCards = document.querySelectorAll('.activity-card[style="display: block"]');
            const activitiesContainer = document.querySelector('.activities-list');
            
            let noResultsMessage = document.querySelector('.no-results-message');
            if (visibleCards.length === 0) {
                if (!noResultsMessage) {
                    noResultsMessage = document.createElement('div');
                    noResultsMessage.className = 'no-results-message';
                    noResultsMessage.innerHTML = `
                        <p>Nenhuma atividade encontrada para ${dateStr}.</p>
                        <p>Tente selecionar outra data ou limpar os filtros.</p>
                    `;
                    activitiesContainer.appendChild(noResultsMessage);
                }
            } else {
                if (noResultsMessage) {
                    noResultsMessage.remove();
                }
            }
            
            // Rolar para a seção de atividades
            const activitiesSection = document.querySelector('.activities-section');
            if (activitiesSection) {
                activitiesSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Fallback para alerta se o filtro não estiver disponível
            alert(`Eventos para ${dateStr}:\n\n${eventsList}\n\nClique em "Ver Todas as Atividades" para mais detalhes.`);
        }
    }
    
    // Event listeners para navegação
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Carregar eventos e renderizar calendário inicial
    loadEvents();
}

