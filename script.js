document.addEventListener('DOMContentLoaded', function () {
    // --- SELETORES DE ELEMENTOS ---
    const form = document.getElementById('evaluationForm');
    const coordinatorSelect = document.getElementById('coordinator');
    const courseSelect = document.getElementById('course');
    const finalGradeSpan = document.getElementById('finalGrade');
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonSpinner = submitButton.querySelector('.spinner');
    const responseMessage = document.getElementById('responseMessage');
    const progressBar = document.getElementById('progressBar');
    const promptContainer = document.getElementById('promptContainer');
    const promptHeader = document.getElementById('promptHeader');
    const aiResponseTextarea = document.getElementById('aiResponse');
    const distributeBtn = document.getElementById('distributeResponseBtn');

    
    const data = {
        "Ataide Ribeiro da Silva Junior": [
            "A Escola do Futuro", "Alfabetização e Letramento", "Alfabetização e Letramento e a Psicopedagogia Institucional",
            "Atendimento Educacional Especializado", "Docência do Ensino Superior", "Educação Ambiental",
            "Educação de Jovens e Adultos", "Educação Especial com Ênfase em Deficiência Intelectual",
            "Educação Especial com Ênfase em Deficiência Intelectual, Física e Psicomotora",
            "Educação Especial com Ênfase em Transtornos Globais de Desenvolvimento (TGD) e Altas Habilidades",
            "Educação Especial e Inclusiva", "Educação Especial e Inclusiva com Ênfase em Tecnologia Assistiva e Comunicação Alternativa",
            "Educação Inclusiva", "Educação Infantil", "Ensino Lúdico", "Ensino Religioso",
            "Gestão e Organização escolar para GOE", "Gestão Escolar", "História e Cultura Afro-Brasileira",
            "Ludicidade e Psicomotricidade na Educação Infantil", "Metodologia do Ensino da Matemática",
            "Metodologia do Ensino de Arte", "Metodologia do Ensino de História e Geografia",
            "Metodologia do Ensino de Língua Inglesa", "Metodologias Ativas", "Neuropsicopedagogia",
            "Orientação Escolar", "Psicomotricidade", "Psicomotricidade e Educação Especial",
            "Psicomotricidade e Movimento", "Psicopedagogia", "Psicopedagogia Clínica e Institucional",
            "Psicopedagogia e Educação Especial", "Supervisão Escolar", "Tecnologias Educacionais",
            "Tutoria em Educação a Distância"
        ],
        "Diego Muniz Braga": [
            "Administração Pública", "Empreendedorismo e Inovação", "Marketing 4.0", "Marketing Digital",
            "Marketing e Customer Experience", "MBA Compliance e Governança", "MBA Finanças e Controladoria",
            "MBA Gestão Comercial", "MBA Gestão de Investimento", "MBA Gestão de Projetos",
            "MBA Gestão estratégica de Negócios", "MBA Gestão Estratégica de Pessoas",
            "Recrutamento e Employer branding", "Supply Chain", "Treinamento e Coaching profissional"
        ],
        "Jair Antonio Motta Barbosa": ["Segurança Pública"],
        "Juliana de Almeida Pachioni": ["MBA Gestão Hospitalar", "Saúde Pública com Ênfase em Saúde da Família"],
        "Mayke Akihyto Iyusuka": [
            "Direito Administrativo", "Direito Digital e Proteção de Dados", "Direito Penal",
            "Direito Penal e Segurança Pública"
        ],
        "Osvaldo Domingos da Silva Junior": ["Full Stack Development - Design, Engineering & Deployment"],
        "Paula Coimbra": [
            "Análise Comportamental Aplicada (ABA) para pessoas com Transtorno do Espectro Autista (TEA)",
            "Psicologia Organizacional", "Psicologia Positiva nas Organizações"
        ],
        "Sebastiao Garcia Junior": ["Gestão Ambiental", "MBA Gestão de Obras"],
        "Solival Jose de Almeida Santos Filho": ["Educação Física Escolar", "Educação Física Escolar com Ênfase em Inclusão"]
    };

    const weights = {
        relevancia_disciplinas: 0.15, nomenclatura_disciplinas: 0.10,
        atualizacao_conteudo: 0.30, importancia_mercado: 0.30,
        qualidade_atividades: 0.15
    };

    const requiredInputs = Array.from(form.querySelectorAll('[required]'));

       // --- FUNÇÕES ---

    function populateCoordinators() {
        coordinatorSelect.innerHTML = '<option value="" selected disabled></option>';
        for (const coordinator in data) {
            const option = new Option(coordinator, coordinator);
            coordinatorSelect.appendChild(option);
        }
    }

    function updateCourses() {
        const selectedCoordinator = coordinatorSelect.value;
        courseSelect.innerHTML = '<option value="" selected disabled></option>';
        if (selectedCoordinator && data[selectedCoordinator]) {
            data[selectedCoordinator].forEach(course => {
                const option = new Option(course, course);
                courseSelect.appendChild(option);
            });
        }
    }

    function calculateFinalGrade() {
        let totalWeightedScore = 0;
        form.querySelectorAll('input[type="number"]').forEach(input => {
            const value = parseFloat(input.value) || 0;
            const weight = weights[input.name];
            if (weight) {
                totalWeightedScore += value * weight;
            }
        });
        finalGradeSpan.textContent = totalWeightedScore.toFixed(2);
    }

    function updateProgressBar() {
        const filledCount = requiredInputs.filter(input => input.value.trim() !== '' && input.value !== null).length;
        const progress = (filledCount / requiredInputs.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    function showMessage(message, type) {
        responseMessage.textContent = message;
        responseMessage.className = type;
    }

    function setButtonLoading(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonSpinner.style.display = 'block';
        } else {
            submitButton.disabled = false;
            buttonText.style.display = 'block';
            buttonSpinner.style.display = 'none';
        }
    }
    
    function parseAndDistributeAIResponse() {
        const text = aiResponseTextarea.value;
        if (!text) {
            alert("Por favor, cole a resposta da IA primeiro.");
            return;
        }

        // ================== CORREÇÃO APLICADA AQUI ==================
        // Usamos partes únicas e sem acento das palavras para garantir a correspondência
        const keywordMap = {
            'relev': { nota: 'relevancia_disciplinas', comentario: 'comentario_relevancia' }, // de Relevância
            'nomenclatura': { nota: 'nomenclatura_disciplinas', comentario: 'comentario_nomenclatura' },
            'atualiza': { nota: 'atualizacao_conteudo', comentario: 'comentario_atualizacao' }, // de Atualização
            'mercado': { nota: 'importancia_mercado', comentario: 'comentario_importancia' },
            'atividades': { nota: 'qualidade_atividades', comentario: 'comentario_qualidade' }
        };
        // =============================================================

        let fieldsFilled = 0;
        
        for (const keyword in keywordMap) {
            // A Regex agora é robusta o suficiente para as variações de palavras
            const noteRegex = new RegExp(`nota[^:]*${keyword}[^:]*:\\s*([0-9.,]+)`, 'i');
            const noteMatch = text.match(noteRegex);
            
            if (noteMatch && noteMatch[1]) {
                const fieldName = keywordMap[keyword].nota;
                const input = document.querySelector(`input[name="${fieldName}"]`);
                if (input) {
                    input.value = noteMatch[1].replace(',', '.');
                    fieldsFilled++;
                }
            }

            const justificationRegex = new RegExp(`(justificativa|resumo)[^:]*${keyword}[^:]*:\\s*([\\s\\S]*?)(?=(nota\\s|justificativa|resumo|👉)|$)`, 'i');
            const justificationMatch = text.match(justificationRegex);

            if (justificationMatch && justificationMatch[2]) {
                const fieldName = keywordMap[keyword].comentario;
                const textarea = document.querySelector(`textarea[name="${fieldName}"]`);
                if (textarea) {
                    textarea.value = justificationMatch[2].trim();
                    fieldsFilled++;
                }
            }
        }

        form.dispatchEvent(new Event('input', { bubbles: true }));

        if (fieldsFilled > 0) {
            alert(`Campos preenchidos com sucesso!\n\nPor favor, revise as notas e justificativas.`);
        } else {
            alert(`Não foi possível encontrar notas ou justificativas no texto.\n\nVerifique se a resposta da IA segue o formato solicitado.`);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        setButtonLoading(true);
        
        const formData = new FormData(form);
        formData.append('nota_final', finalGradeSpan.textContent);
        const dataObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzmFsjha5WzzVFf3EV8Xz4m-WbcDYnR6ZdHnaHsqBfTCqagC68tMQMDkq6T7csXY3lZ/exec', {
                method: 'POST',
                body: JSON.stringify(dataObject)
            });
            
            const resultText = await response.text();
            const result = JSON.parse(resultText);

            if (result.result === 'success') {
                showMessage('Avaliação enviada com sucesso!', 'success');
                form.reset();
                aiResponseTextarea.value = '';
                updateCourses();
                calculateFinalGrade();
                updateProgressBar();
            } else {
                throw new Error(result.message || 'Ocorreu um erro.');
            }
        } catch (error) {
            showMessage(`Erro ao enviar: ${error.message}`, 'error');
        } finally {
            setButtonLoading(false);
        }
    }

    // --- EVENT LISTENERS ---
    coordinatorSelect.addEventListener('change', updateCourses);
    form.addEventListener('input', () => {
        calculateFinalGrade();
        updateProgressBar();
    });
    form.addEventListener('submit', handleFormSubmit);

    if (promptHeader) {
        promptHeader.addEventListener('click', () => {
            promptContainer.classList.toggle('active');
        });
    }

    distributeBtn.addEventListener('click', parseAndDistributeAIResponse);

    // --- INICIALIZAÇÃO ---
    populateCoordinators();
    updateProgressBar();
});