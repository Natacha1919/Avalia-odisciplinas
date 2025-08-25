document.addEventListener('DOMContentLoaded', function() {
    const coordinatorSelect = document.getElementById('coordinator');
    const courseSelect = document.getElementById('course');
    const form = document.getElementById('evaluationForm');
    const finalGradeSpan = document.getElementById('finalGrade');
    const submitButton = document.getElementById('submitButton');
    const loadingDiv = document.getElementById('loading');
    const responseMessage = document.getElementById('responseMessage');

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

    // Preenche o seletor de coordenadores
    for (const coordinator in data) {
        const option = document.createElement('option');
        option.value = coordinator;
        option.textContent = coordinator;
        coordinatorSelect.appendChild(option);
    }

    // Atualiza os cursos quando um coordenador é selecionado
    coordinatorSelect.addEventListener('change', function() {
        const selectedCoordinator = this.value;
        courseSelect.innerHTML = '<option value="">--Selecione--</option>';
        if (selectedCoordinator && data[selectedCoordinator]) {
            data[selectedCoordinator].forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
        }
    });

    // Calcula a nota final ponderada
    const inputs = form.querySelectorAll('input[type="number"]');
    const weights = {
        relevancia_disciplinas: 0.15,
        nomenclatura_disciplinas: 0.10,
        atualizacao_conteudo: 0.30,
        importancia_mercado: 0.30,
        qualidade_atividades: 0.15
    };

    function calculateFinalGrade() {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        let allFilled = true;

        inputs.forEach(input => {
            const value = parseFloat(input.value);
            const weight = weights[input.name];
            if (!isNaN(value) && value >= 0 && value <= 10) {
                totalWeightedScore += value * weight;
                totalWeight += weight;
            } else {
                allFilled = false;
            }
        });

        if (allFilled) {
             finalGradeSpan.textContent = totalWeightedScore.toFixed(2);
        } else {
             finalGradeSpan.textContent = '0.00';
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', calculateFinalGrade);
    });

    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitButton.disabled = true;
        loadingDiv.style.display = 'block';
        responseMessage.textContent = '';
        
        const formData = new FormData(form);
        formData.append('nota_final', finalGradeSpan.textContent);
        
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        fetch('https://script.google.com/macros/s/AKfycbzmFsjha5WzzVFf3EV8Xz4m-WbcDYnR6ZdHnaHsqBfTCqagC68tMQMDkq6T7csXY3lZ/exec', {
            method: 'POST',
            body: JSON.stringify(dataObject)
        })
        .then(response => response.json())
        .then(data => {
            if(data.result === 'success') {
                responseMessage.textContent = 'Avaliação enviada com sucesso!';
                responseMessage.style.color = 'green';
                form.reset();
                finalGradeSpan.textContent = '0.00';
            } else {
                throw new Error(data.message || 'Ocorreu um erro.');
            }
        })
        .catch(error => {
            responseMessage.textContent = 'Erro ao enviar avaliação: ' + error.message;
            responseMessage.style.color = 'red';
        })
        .finally(() => {
            submitButton.disabled = false;
            loadingDiv.style.display = 'none';
        });
    });
});