// ===== APLICAÇÃO PRINCIPAL =====
class ReportApp {
    constructor() {
        this.currentStep = 1;
        this.selectedTurno = null;
        this.userName = '';
        this.selectedFiles = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStepIndicator();
        this.setupFileHandling();
        this.setupPasteHandler();
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
    }
    
    setupFileHandling() {
        const fotosInput = document.getElementById('fotos');
        const fileUploadArea = document.querySelector('.file-upload-area');
        
        if (fotosInput && fileUploadArea) {
            // Change event para input file
            fotosInput.addEventListener('change', () => this.handleFileSelect());
            
            // Drag and drop
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('dragover');
            });
            
            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.classList.remove('dragover');
            });
            
            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
                this.handleFileDrop(e);
            });
        }
    }
    
    setupPasteHandler() {
        // Event listener global para paste
        document.addEventListener('paste', (e) => {
            // Só funciona quando estamos no step 3 (formulário)
            if (this.currentStep === 3) {
                this.handlePaste(e);
            }
        });
        
        // Visual feedback quando área está focada
        const fileUploadArea = document.querySelector('.file-upload-area');
        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', () => {
                fileUploadArea.focus();
            });
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
    
    handleFileSelect() {
        const fotosInput = document.getElementById('fotos');
        const files = Array.from(fotosInput.files);
        this.addFiles(files);
    }
    
    handleFileDrop(e) {
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        this.addFiles(imageFiles);
    }
    
    handlePaste(e) {
        const items = Array.from(e.clipboardData.items);
        const imageItems = items.filter(item => item.type.startsWith('image/'));
        
        if (imageItems.length > 0) {
            e.preventDefault();
            
            // Visual feedback
            const fileUploadArea = document.querySelector('.file-upload-area');
            fileUploadArea.classList.add('pasting');
            setTimeout(() => fileUploadArea.classList.remove('pasting'), 1000);
            
            // Processar imagens
            imageItems.forEach(item => {
                const file = item.getAsFile();
                if (file) {
                    this.addFiles([file]);
                }
            });
            
            this.showAlert('Imagem(ns) colada(s) com sucesso!', 'success');
        }
    }
    
    addFiles(files) {
        // Validar arquivos
        const validFiles = files.filter(file => {
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                this.showAlert(`${file.name} não é uma imagem válida.`, 'error');
                return false;
            }
            
            // Validar tamanho (10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showAlert(`${file.name} é muito grande. Máximo 10MB.`, 'error');
                return false;
            }
            
            return true;
        });
        
        // Adicionar à lista
        validFiles.forEach(file => {
            // Evitar duplicatas (baseado no nome e tamanho)
            const isDuplicate = this.selectedFiles.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            );
            
            if (!isDuplicate) {
                this.selectedFiles.push(file);
            }
        });
        
        this.updateFilePreview();
        this.updateFileUploadStatus();
    }
    
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFilePreview();
        this.updateFileUploadStatus();
    }
    
    updateFilePreview() {
        const preview = document.getElementById('photos-preview');
        
        if (this.selectedFiles.length === 0) {
            preview.innerHTML = '';
            return;
        }
        
        preview.innerHTML = this.selectedFiles.map((file, index) => {
            const url = URL.createObjectURL(file);
            return `
                <div class="photo-preview-item">
                    <img src="${url}" alt="${file.name}" loading="lazy">
                    <button class="remove-photo" onclick="window.reportApp.removeFile(${index})" title="Remover foto">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
    
    updateFileUploadStatus() {
        const fileUploadArea = document.querySelector('.file-upload-area');
        const content = fileUploadArea.querySelector('.file-upload-content');
        
        if (this.selectedFiles.length > 0) {
            fileUploadArea.classList.add('has-files');
            content.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p><strong>${this.selectedFiles.length} foto(s) selecionada(s)</strong></p>
                <small>Clique para adicionar mais ou cole novas imagens</small>
            `;
            
            // Adicionar contador
            let countElement = fileUploadArea.querySelector('.photos-count');
            if (!countElement) {
                countElement = document.createElement('div');
                countElement.className = 'photos-count';
                fileUploadArea.appendChild(countElement);
            }
            
            countElement.innerHTML = `
                <i class="fas fa-images"></i>
                <span>${this.selectedFiles.length} foto(s) pronta(s) para envio</span>
            `;
        } else {
            fileUploadArea.classList.remove('has-files');
            content.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Clique para selecionar fotos, arraste aqui ou <strong>cole (Ctrl+V)</strong></p>
                <small>JPG, PNG, GIF até 10MB cada • Múltiplas fotos permitidas</small>
            `;
            
            const countElement = fileUploadArea.querySelector('.photos-count');
            if (countElement) {
                countElement.remove();
            }
        }
    }
    
    async submitReport(e) {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Adicionar dados do formulário
        formData.append('turno', this.selectedTurno);
        formData.append('usuario', this.userName);
        formData.append('texto', document.getElementById('texto').value.trim());
        
        // Adicionar fotos
        this.selectedFiles.forEach(file => {
            formData.append('fotos', file);
        });
        
        // Valida dados obrigatórios
        if (!formData.get('texto')) {
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
                const message = result.fotos_count > 0 
                    ? `Relatório criado com ${result.fotos_count} foto(s)!`
                    : 'Relatório criado com sucesso!';
                this.showSuccessWithMessage(message);
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
    
    showSuccessWithMessage(message) {
        const modal = document.getElementById('success-modal');
        const messageEl = modal.querySelector('p');
        messageEl.textContent = message;
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
    
    // Reseta upload de arquivos
    const fileUploadArea = document.querySelector('.file-upload-area');
    fileUploadArea.classList.remove('has-files');
    const content = fileUploadArea.querySelector('.file-upload-content');
    content.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Clique para selecionar fotos, arraste aqui ou <strong>cole (Ctrl+V)</strong></p>
        <small>JPG, PNG, GIF até 10MB cada • Múltiplas fotos permitidas</small>
    `;
    
    // Limpar preview
    document.getElementById('photos-preview').innerHTML = '';
    
    // Remover contador de fotos
    const countElement = fileUploadArea.querySelector('.photos-count');
    if (countElement) {
        countElement.remove();
    }
    
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