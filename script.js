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

    const data = {
        "Ataide Ribeiro da Silva Junior": ["A Escola do Futuro", "Alfabetização e Letramento", /* ...e outros... */],
        "Diego Muniz Braga": ["Administração Pública", "Empreendedorismo e Inovação", /* ...e outros... */],
        "Jair Antonio Motta Barbosa": ["Segurança Pública"],
        "Juliana de Almeida Pachioni": ["MBA Gestão Hospitalar", "Saúde Pública com Ênfase em Saúde da Família"],
        "Mayke Akihyto Iyusuka": ["Direito Administrativo", "Direito Digital e Proteção de Dados", /* ...e outros... */],
        "Osvaldo Domingos da Silva Junior": ["Full Stack Development - Design, Engineering & Deployment"],
        "Paula Coimbra": ["Análise Comportamental Aplicada (ABA) para pessoas com Transtorno do Espectro Autista (TEA)", /* ...e outros... */],
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
        const filledCount = requiredInputs.filter(input => input.value.trim() !== '').length;
        const progress = (filledCount / requiredInputs.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    function showMessage(message, type) {
        responseMessage.textContent = message;
        responseMessage.className = type; // Apenas 'success' ou 'error'
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

    // --- INICIALIZAÇÃO ---
    populateCoordinators();
    updateProgressBar();
});