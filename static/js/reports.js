// ===== APLICAÇÃO DE RELATÓRIOS =====
class ReportsApp {
    constructor() {
        this.currentFilter = '';
        this.reports = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadReports();
    }
    
    setupEventListeners() {
        // Filtros de turno
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByTurno(e));
        });
        
        // Fechar modal de foto
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePhotoModal();
            }
        });
        
        // Clique fora do modal para fechar
        const photoModal = document.getElementById('photo-modal');
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                this.closePhotoModal();
            }
        });
    }
    
    filterByTurno(e) {
        // Remove filtro ativo anterior
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ativa novo filtro
        e.currentTarget.classList.add('active');
        
        // Obtém valor do filtro
        this.currentFilter = e.currentTarget.dataset.turno;
        
        // Recarrega relatórios com filtro
        this.loadReports();
    }
    
    async loadReports() {
        this.showLoading(true);
        
        try {
            let url = '/api/reports';
            if (this.currentFilter) {
                url += `?turno=${this.currentFilter}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar relatórios');
            }
            
            this.reports = await response.json();
            this.renderReports();
            this.updateStats();
            
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
            this.showError('Erro ao carregar relatórios. Tente novamente.');
        } finally {
            this.showLoading(false);
        }
    }
    
    renderReports() {
        const timeline = document.getElementById('timeline');
        const emptyState = document.getElementById('timeline-empty');
        
        if (this.reports.length === 0) {
            timeline.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }
        
        emptyState.style.display = 'none';
        
        timeline.innerHTML = this.reports.map(report => this.createReportCard(report)).join('');
        
        // Adiciona event listeners para fotos
        this.setupPhotoListeners();
    }
    
    createReportCard(report) {
        const date = new Date(report.data_criacao);
        const formattedDate = this.formatDate(date);
        const timeAgo = this.getTimeAgo(date);
        
        return `
            <div class="report-card" data-id="${report.id}">
                <div class="report-header">
                    <div class="report-meta">
                        <div class="report-user">
                            <i class="fas fa-user"></i>
                            ${this.escapeHtml(report.usuario)}
                        </div>
                        <div class="report-turno turno-${report.turno}">
                            <i class="fas fa-${this.getTurnoIcon(report.turno)}"></i>
                            ${report.turno_nome}
                        </div>
                    </div>
                    <div class="report-date" title="${formattedDate}">
                        ${timeAgo}
                    </div>
                </div>
                <div class="report-content">
                    <div class="report-text">${this.escapeHtml(report.texto)}</div>
                    ${report.foto_url ? `
                        <div class="report-photo">
                            <img src="${report.foto_url}" 
                                 alt="Foto do relatório" 
                                 onclick="showPhotoModal('${report.foto_url}')"
                                 loading="lazy">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    setupPhotoListeners() {
        // Event listeners já são configurados via onclick no HTML
        // Isso é intencional para simplicidade
    }
    
    updateStats() {
        const count = this.reports.length;
        const statsEl = document.getElementById('reports-count');
        
        if (count === 0) {
            statsEl.textContent = 'Nenhum relatório';
        } else if (count === 1) {
            statsEl.textContent = '1 relatório';
        } else {
            statsEl.textContent = `${count} relatórios`;
        }
        
        // Atualiza título baseado no filtro
        const titleEl = document.getElementById('timeline-title');
        const icon = '<i class="fas fa-clock"></i>';
        
        if (this.currentFilter) {
            const turnoName = document.querySelector(`[data-turno="${this.currentFilter}"]`).textContent.trim();
            titleEl.innerHTML = `${icon} ${turnoName} - Timeline`;
        } else {
            titleEl.innerHTML = `${icon} Timeline de Atividades`;
        }
    }
    
    showLoading(show) {
        const loading = document.getElementById('timeline-loading');
        const timeline = document.getElementById('timeline');
        
        if (show) {
            loading.style.display = 'flex';
            timeline.style.display = 'none';
        } else {
            loading.style.display = 'none';
            timeline.style.display = 'block';
        }
    }
    
    showError(message) {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Ops! Algo deu errado</h3>
                <p>${message}</p>
                <button class="btn-primary" onclick="window.reportsApp.loadReports()">
                    <i class="fas fa-refresh"></i>
                    Tentar Novamente
                </button>
            </div>
        `;
    }
    
    closePhotoModal() {
        const modal = document.getElementById('photo-modal');
        modal.classList.remove('active');
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    getTurnoIcon(turno) {
        const icons = {
            1: 'sun',
            2: 'cloud-sun',
            3: 'moon'
        };
        return icons[turno] || 'clock';
    }
    
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Agora mesmo';
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} min atrás`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours}h atrás`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
        }
        
        // Para períodos maiores, mostra a data formatada
        return this.formatDate(date);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===== FUNÇÕES GLOBAIS =====
function showPhotoModal(photoUrl) {
    const modal = document.getElementById('photo-modal');
    const img = document.getElementById('modal-photo-img');
    
    img.src = photoUrl;
    modal.classList.add('active');
}

function closePhotoModal() {
    window.reportsApp.closePhotoModal();
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    window.reportsApp = new ReportsApp();
});

// ===== AUTO REFRESH =====
// Recarrega relatórios a cada 30 segundos para mostrar novos relatórios
setInterval(() => {
    if (document.visibilityState === 'visible') {
        window.reportsApp.loadReports();
    }
}, 30000);

// ===== ESTILOS CSS PARA ERROR STATE =====
const errorStyles = `
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
}

.error-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #fef2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.error-icon i {
    font-size: 2rem;
    color: #ef4444;
}

.error-state h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.error-state p {
    color: #6b7280;
    margin-bottom: 1.5rem;
}
`;

// Adiciona estilos do error state
const errorStyleSheet = document.createElement('style');
errorStyleSheet.textContent = errorStyles;
document.head.appendChild(errorStyleSheet);