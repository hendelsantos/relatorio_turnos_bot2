// ===== APLICAÇÃO PRINCIPAL =====
class ReportApp {
    constructor() {
        this.currentStep = 1;
        this.selectedTurno = null;
        this.userName = '';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStepIndicator();
    }
    
    setupEventListeners() {
        // Seleção de turno
        document.querySelectorAll('.turno-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTurno(e));
        });
        
        // Botão de continuar após nome
        const btnNome = document.getElementById('btn-nome');
        if (btnNome) {
            btnNome.addEventListener('click', () => this.validateNameAndContinue());
        }
        
        // Input do nome - enter para continuar
        const usuarioInput = document.getElementById('usuario');
        if (usuarioInput) {
            usuarioInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validateNameAndContinue();
                }
            });
            
            usuarioInput.addEventListener('input', () => this.validateNameInput());
        }
        
        // Botão voltar
        const btnVoltar = document.getElementById('btn-voltar');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => this.goToStep(2));
        }
        
        // Formulário de relatório
        const reportForm = document.getElementById('report-form');
        if (reportForm) {
            reportForm.addEventListener('submit', (e) => this.submitReport(e));
        }
        
        // Upload de arquivo
        const fotoInput = document.getElementById('foto');
        if (fotoInput) {
            fotoInput.addEventListener('change', () => this.handleFileUpload());
        }
    }
    
    selectTurno(e) {
        // Remove seleção anterior
        document.querySelectorAll('.turno-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        e.currentTarget.classList.add('selected');
        this.selectedTurno = parseInt(e.currentTarget.dataset.turno);
        
        // Avança para próximo step após pequeno delay
        setTimeout(() => {
            this.goToStep(2);
        }, 600);
    }
    
    validateNameInput() {
        const usuarioInput = document.getElementById('usuario');
        const btnNome = document.getElementById('btn-nome');
        
        if (usuarioInput.value.trim().length >= 2) {
            btnNome.disabled = false;
            btnNome.style.opacity = '1';
        } else {
            btnNome.disabled = true;
            btnNome.style.opacity = '0.5';
        }
    }
    
    validateNameAndContinue() {
        const usuarioInput = document.getElementById('usuario');
        const name = usuarioInput.value.trim();
        
        if (name.length < 2) {
            this.showAlert('Por favor, digite um nome válido com pelo menos 2 caracteres.', 'error');
            usuarioInput.focus();
            return;
        }
        
        this.userName = name;
        this.goToStep(3);
    }
    
    goToStep(step) {
        // Valida se pode avançar
        if (step > this.currentStep) {
            if (step === 2 && !this.selectedTurno) {
                this.showAlert('Selecione um turno primeiro.', 'error');
                return;
            }
            
            if (step === 3 && !this.userName) {
                this.showAlert('Digite seu nome primeiro.', 'error');
                return;
            }
        }
        
        // Atualiza step atual
        this.currentStep = step;
        
        // Oculta todos os steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Mostra step atual
        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Atualiza indicador
        this.updateStepIndicator();
        
        // Preenche dados no formulário se chegou ao step 3
        if (step === 3) {
            this.fillFormData();
        }
        
        // Foca no primeiro input do step
        this.focusFirstInput();
    }
    
    updateStepIndicator() {
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            const stepNumber = index + 1;
            
            stepEl.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                stepEl.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                stepEl.classList.add('completed');
            }
        });
    }
    
    fillFormData() {
        document.getElementById('turno-hidden').value = this.selectedTurno;
        document.getElementById('usuario-hidden').value = this.userName;
    }
    
    focusFirstInput() {
        setTimeout(() => {
            const currentStep = document.querySelector('.form-step.active');
            const firstInput = currentStep?.querySelector('input:not([type=\"hidden\"]), textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
    
    handleFileUpload() {
        const fotoInput = document.getElementById('foto');
        const fileUpload = document.querySelector('.file-upload');
        
        if (fotoInput.files.length > 0) {
            const file = fotoInput.files[0];
            
            // Valida tipo de arquivo
            if (!file.type.startsWith('image/')) {
                this.showAlert('Por favor, selecione apenas arquivos de imagem.', 'error');
                fotoInput.value = '';
                return;
            }
            
            // Valida tamanho (10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showAlert('A imagem deve ter no máximo 10MB.', 'error');
                fotoInput.value = '';
                return;
            }
            
            fileUpload.classList.add('has-file');
            const content = fileUpload.querySelector('.file-upload-content');
            content.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p><strong>${file.name}</strong></p>
                <small>Arquivo selecionado com sucesso</small>
            `;
        } else {
            fileUpload.classList.remove('has-file');
            const content = fileUpload.querySelector('.file-upload-content');
            content.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Clique para selecionar uma foto ou arraste aqui</p>
                <small>JPG, PNG, GIF até 10MB</small>
            `;
        }
    }
    
    async submitReport(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Valida dados obrigatórios
        if (!formData.get('texto').trim()) {
            this.showAlert('Por favor, digite a descrição da atividade.', 'error');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                this.showSuccess();
            } else {
                throw new Error(result.message || 'Erro ao enviar relatório');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            this.showAlert('Erro ao enviar relatório. Tente novamente.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.add('active');
        } else {
            loading.classList.remove('active');
        }
    }
    
    showSuccess() {
        const modal = document.getElementById('success-modal');
        modal.classList.add('active');
    }
    
    showAlert(message, type = 'info') {
        // Remove alertas anteriores
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
}

// ===== FUNÇÕES GLOBAIS =====
function resetForm() {
    // Fecha modal
    document.getElementById('success-modal').classList.remove('active');
    
    // Reinicia aplicação
    window.reportApp = new ReportApp();
    
    // Limpa formulário
    document.getElementById('report-form').reset();
    document.getElementById('usuario').value = '';
    
    // Remove seleções
    document.querySelectorAll('.turno-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reseta upload de arquivo
    const fileUpload = document.querySelector('.file-upload');
    fileUpload.classList.remove('has-file');
    const content = fileUpload.querySelector('.file-upload-content');
    content.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Clique para selecionar uma foto ou arraste aqui</p>
        <small>JPG, PNG, GIF até 10MB</small>
    `;
    
    // Volta para step 1
    window.reportApp.goToStep(1);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    window.reportApp = new ReportApp();
});

// ===== ESTILOS CSS PARA ALERTAS =====
const alertStyles = `
.alert {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
}

.alert-error {
    border-left: 4px solid #ef4444;
}

.alert-info {
    border-left: 4px solid #3b82f6;
}

.alert-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
}

.alert-content i {
    color: #ef4444;
    font-size: 18px;
}

.alert-info .alert-content i {
    color: #3b82f6;
}

.alert-content span {
    flex: 1;
    font-weight: 500;
    color: #374151;
}

.alert-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
}

.alert-close:hover {
    color: #6b7280;
    background: #f3f4f6;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Adiciona estilos dos alertas
const styleSheet = document.createElement('style');
styleSheet.textContent = alertStyles;
document.head.appendChild(styleSheet);