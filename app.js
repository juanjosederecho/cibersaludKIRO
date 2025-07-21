// CIBERSALUD 360 - Aplicación Web
// Desarrollado por estudiantes de CONAMIR - Rosaspata, Huancané, Puno

// Variables globales
let currentUser = '';
let selectedSymptoms = [];
let selectedRefinement = [];
let currentDiagnosis = null;
let consultationHistory = [];

// Síntomas generales (12 síntomas principales)
const generalSymptoms = [
    { id: 'fiebre', icon: '🤒', text: 'Fiebre o temperatura alta', category: 'respiratorio' },
    { id: 'tos', icon: '😷', text: 'Tos persistente', category: 'respiratorio' },
    { id: 'dolor_cabeza', icon: '🤕', text: 'Dolor de cabeza', category: 'general' },
    { id: 'dolor_estomago', icon: '🤢', text: 'Dolor de estómago', category: 'digestivo' },
    { id: 'diarrea', icon: '💩', text: 'Diarrea o deposiciones líquidas', category: 'digestivo' },
    { id: 'fatiga', icon: '😴', text: 'Cansancio o fatiga extrema', category: 'general' },
    { id: 'dificultad_respirar', icon: '😮‍💨', text: 'Dificultad para respirar', category: 'respiratorio' },
    { id: 'dolor_pecho', icon: '💔', text: 'Dolor en el pecho', category: 'respiratorio' },
    { id: 'nauseas', icon: '🤮', text: 'Náuseas o vómitos', category: 'digestivo' },
    { id: 'dolor_muscular', icon: '💪', text: 'Dolor muscular o articular', category: 'general' },
    { id: 'piel_seca', icon: '🧴', text: 'Piel seca o irritada', category: 'dermatologico' },
    { id: 'mareos', icon: '😵‍💫', text: 'Mareos o desmayos', category: 'general' }
];

// Síntomas de refinamiento por categoría
const refinementSymptoms = {
    respiratorio: [
        { id: 'tos_sangre', icon: '🩸', text: 'Tos con sangre o flema' },
        { id: 'silbido_pecho', icon: '🎵', text: 'Silbido al respirar' },
        { id: 'dolor_garganta', icon: '🗣️', text: 'Dolor de garganta intenso' },
        { id: 'congestion', icon: '👃', text: 'Congestión nasal severa' },
        { id: 'sudores_nocturnos', icon: '💦', text: 'Sudores nocturnos' }
    ],
    digestivo: [
        { id: 'sangre_heces', icon: '🩸', text: 'Sangre en las heces' },
        { id: 'perdida_apetito', icon: '🍽️', text: 'Pérdida total del apetito' },
        { id: 'hinchazon', icon: '🫃', text: 'Hinchazón abdominal' },
        { id: 'acidez', icon: '🔥', text: 'Acidez o reflujo constante' },
        { id: 'perdida_peso', icon: '⚖️', text: 'Pérdida de peso inexplicable' }
    ],
    general: [
        { id: 'vision_borrosa', icon: '👁️', text: 'Visión borrosa' },
        { id: 'sed_excesiva', icon: '💧', text: 'Sed excesiva' },
        { id: 'hormigueo', icon: '🖐️', text: 'Hormigueo en manos/pies' },
        { id: 'confusion', icon: '🤔', text: 'Confusión o desorientación' },
        { id: 'palpitaciones', icon: '💓', text: 'Palpitaciones del corazón' }
    ],
    dermatologico: [
        { id: 'picazon_intensa', icon: '🤏', text: 'Picazón intensa' },
        { id: 'erupciones', icon: '🔴', text: 'Erupciones o manchas rojas' },
        { id: 'descamacion', icon: '🧽', text: 'Descamación de la piel' },
        { id: 'grietas_piel', icon: '🪟', text: 'Grietas en manos o pies' },
        { id: 'cambio_color', icon: '🎨', text: 'Cambio de color en la piel' }
    ]
};

// Base de conocimiento de enfermedades del altiplano
const diseases = {
    ira: {
        name: 'Infección Respiratoria Aguda (IRA)',
        description: 'Infección común en el altiplano debido al clima frío y seco de Puno.',
        symptoms: ['fiebre', 'tos', 'dolor_garganta', 'congestion'],
        image: '🫁',
        illustrativeImages: ['🌡️', '🤧', '🍵', '🧣'],
        recommendations: {
            alimentos: ['Mates calientes de muña 🍵', 'Sopas nutritivas 🍲', 'Miel de abeja 🍯', 'Cítricos cuando sea posible 🍊'],
            habitos: ['Abrigarse bien 🧥', 'Evitar cambios bruscos de temperatura 🌡️', 'Descansar adecuadamente 😴'],
            prevencion: ['Lavado frecuente de manos 🧼', 'Evitar aglomeraciones 👥', 'Mantener ambientes ventilados 🪟']
        }
    },
    bronquitis: {
        name: 'Bronquitis',
        description: 'Inflamación de los bronquios, común en el altiplano por el aire seco.',
        symptoms: ['tos', 'dificultad_respirar', 'silbido_pecho', 'fatiga'],
        image: '🫁',
        illustrativeImages: ['💨', '🌿', '🍯', '🚭'],
        recommendations: {
            alimentos: ['Infusiones de eucalipto 🌿', 'Miel con limón 🍯🍋', 'Caldos calientes 🍲'],
            habitos: ['Evitar el humo 🚭', 'Humidificar el ambiente 💧', 'Ejercicios respiratorios suaves 🧘'],
            prevencion: ['No fumar 🚭', 'Evitar contaminantes 🏭', 'Mantener buena higiene respiratoria 😷']
        }
    },
    neumonia: {
        name: 'Neumonía',
        description: 'Infección pulmonar grave que requiere atención médica inmediata.',
        symptoms: ['fiebre', 'dificultad_respirar', 'dolor_pecho', 'tos_sangre'],
        image: '🫁',
        illustrativeImages: ['🚨', '🏥', '💊', '🌡️'],
        recommendations: {
            alimentos: ['Líquidos abundantes 💧', 'Caldos nutritivos 🍲', 'Frutas ricas en vitamina C 🍊'],
            habitos: ['Reposo absoluto 🛏️', 'Seguir tratamiento médico 💊', 'Evitar esfuerzos ⚠️'],
            prevencion: ['Vacunación 💉', 'Evitar exposición al frío extremo ❄️', 'Fortalecer sistema inmune 💪']
        }
    },
    eda: {
        name: 'Enfermedad Diarreica Aguda (EDA)',
        description: 'Trastorno digestivo común por agua o alimentos contaminados.',
        symptoms: ['diarrea', 'dolor_estomago', 'nauseas', 'deshidratacion'],
        image: '🤢',
        illustrativeImages: ['💧', '🍚', '🧼', '🔥'],
        recommendations: {
            alimentos: ['Suero casero 💧🧂', 'Arroz blanco 🍚', 'Plátano maduro 🍌', 'Agua hervida 🔥💧'],
            habitos: ['Hidratación constante 💧', 'Reposo digestivo 🛏️', 'Higiene estricta 🧼'],
            prevencion: ['Hervir el agua 🔥💧', 'Lavar bien los alimentos 🧼🥬', 'Higiene de manos 🧼👐']
        }
    },
    parasitosis: {
        name: 'Parasitosis Intestinal',
        description: 'Infección por parásitos, común en zonas rurales del altiplano.',
        symptoms: ['dolor_estomago', 'diarrea', 'perdida_peso', 'fatiga'],
        image: '🪱',
        illustrativeImages: ['🧄', '🎃', '🧼', '🔥'],
        recommendations: {
            alimentos: ['Ajo crudo 🧄', 'Semillas de zapallo 🎃', 'Papaya 🥭', 'Agua hervida 🔥💧'],
            habitos: ['Desparasitación regular 💊', 'Higiene personal 🧼', 'Cocinar bien los alimentos 🔥🍖'],
            prevencion: ['Lavar frutas y verduras 🧼🥬', 'Agua segura 💧✅', 'Evitar carnes crudas 🚫🥩']
        }
    },
    anemia: {
        name: 'Anemia',
        description: 'Deficiencia de hierro, muy común en el altiplano de Puno.',
        symptoms: ['fatiga', 'mareos', 'piel_palida', 'dificultad_respirar'],
        image: '🩸',
        illustrativeImages: ['🌾', '🫘', '🦙', '🥬'],
        recommendations: {
            alimentos: ['Quinua 🌾', 'Habas 🫘', 'Carne de alpaca 🦙', 'Espinacas 🥬', 'Hígado 🫀'],
            habitos: ['Ejercicio moderado 🚶', 'Exposición al sol ☀️', 'Suplementos de hierro 💊'],
            prevencion: ['Dieta rica en hierro 🥩', 'Vitamina C para absorción 🍊', 'Control médico regular 👩‍⚕️']
        }
    },
    desnutricion: {
        name: 'Desnutrición Crónica',
        description: 'Deficiencia nutricional que afecta el desarrollo, especialmente en niños.',
        symptoms: ['perdida_peso', 'fatiga', 'crecimiento_lento', 'infecciones_frecuentes'],
        image: '⚖️',
        illustrativeImages: ['🌾', '🥛', '🍖', '👶'],
        recommendations: {
            alimentos: ['Quinua 🌾', 'Kiwicha 🌾', 'Leche y derivados 🥛', 'Carnes 🍖', 'Legumbres 🫘'],
            habitos: ['Comidas frecuentes 🍽️⏰', 'Suplementos nutricionales 💊', 'Control de peso ⚖️'],
            prevencion: ['Alimentación balanceada 🥗', 'Lactancia materna 🤱', 'Control nutricional 📊']
        }
    },
    hipertension: {
        name: 'Hipertensión Arterial',
        description: 'Presión arterial elevada, relacionada con la altura y estilo de vida.',
        symptoms: ['dolor_cabeza', 'mareos', 'vision_borrosa', 'palpitaciones'],
        image: '💓',
        illustrativeImages: ['🩺', '🧂', '🥗', '🏃'],
        recommendations: {
            alimentos: ['Reducir sal 🧂❌', 'Frutas y verduras 🥗', 'Pescado 🐟', 'Evitar frituras 🍟❌'],
            habitos: ['Ejercicio regular 🏃', 'Control de peso ⚖️', 'Reducir estrés 🧘', 'No fumar 🚭'],
            prevencion: ['Dieta baja en sodio 🧂⬇️', 'Actividad física 🏃', 'Control médico regular 🩺']
        }
    },
    diabetes: {
        name: 'Diabetes Tipo 2',
        description: 'Trastorno metabólico que requiere control constante de glucosa.',
        symptoms: ['sed_excesiva', 'vision_borrosa', 'fatiga', 'hormigueo'],
        image: '🍯',
        illustrativeImages: ['🩸', '🌾', '🥗', '🏃'],
        recommendations: {
            alimentos: ['Quinua 🌾', 'Verduras 🥗', 'Carnes magras 🍖', 'Evitar azúcares 🍬❌'],
            habitos: ['Control de glucosa 🩸📊', 'Ejercicio diario 🏃', 'Medicación puntual 💊⏰'],
            prevencion: ['Dieta balanceada 🥗', 'Peso saludable ⚖️✅', 'Actividad física regular 🏃']
        }
    },
    dermatitis: {
        name: 'Dermatitis por Frío',
        description: 'Irritación de la piel causada por el clima extremo del altiplano.',
        symptoms: ['piel_seca', 'picazon_intensa', 'grietas_piel', 'descamacion'],
        image: '🧴',
        illustrativeImages: ['❄️', '🧴', '🧥', '💧'],
        recommendations: {
            alimentos: ['Aceites naturales 🫒', 'Vitamina E 💊', 'Agua abundante 💧'],
            habitos: ['Hidratación de piel 🧴', 'Protección del frío 🧥', 'Ropa adecuada 👕'],
            prevencion: ['Cremas protectoras 🧴', 'Evitar jabones fuertes 🧼❌', 'Humidificar ambiente 💨']
        }
    }
};

// Equipo CONAMIR
const teamMembers = [
    { name: 'Woendy', icon: '💡', virtues: ['Innovador', 'Líder', 'Creativo'] },
    { name: 'Yeseth', icon: '📊', virtues: ['Analítico', 'Detallista', 'Organizado'] },
    { name: 'Elvis', icon: '💻', virtues: ['Técnico', 'Solucionador', 'Eficiente'] },
    { name: 'Maikel', icon: '🎯', virtues: ['Estratega', 'Enfocado', 'Determinado'] },
    { name: 'Fernanda', icon: '🤝', virtues: ['Colaborativa', 'Empática', 'Comunicativa'] },
    { name: 'Miriam', icon: '🔍', virtues: ['Investigadora', 'Curiosa', 'Meticulosa'] },
    { name: 'Danny', icon: '⚡', virtues: ['Dinámico', 'Proactivo', 'Entusiasta'] }
];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    renderGeneralSymptoms();
    renderRecommendations();
    renderTeam();
});

// Funciones principales
function startConsultation() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Por favor, ingresa tu nombre para continuar.');
        return;
    }
    
    currentUser = name;
    updateUserGreeting();
    showScreen('consulta');
    document.getElementById('navTabs').style.display = 'flex';
}

function updateUserGreeting() {
    const greetingElement = document.getElementById('greetingText');
    const greetingContainer = document.getElementById('userGreeting');
    
    if (currentUser) {
        greetingElement.textContent = `Hola ${currentUser}`;
        greetingContainer.style.display = 'block';
    }
}

function renderGeneralSymptoms() {
    const grid = document.getElementById('symptomsGrid');
    grid.innerHTML = '';
    
    generalSymptoms.forEach(symptom => {
        const card = document.createElement('div');
        card.className = 'symptom-card';
        card.dataset.symptomId = symptom.id;
        card.innerHTML = `
            <span class="symptom-icon">${symptom.icon}</span>
            <div class="symptom-text">${symptom.text}</div>
        `;
        
        card.addEventListener('click', () => toggleSymptom(symptom.id, card));
        grid.appendChild(card);
    });
}

function toggleSymptom(symptomId, cardElement) {
    const index = selectedSymptoms.indexOf(symptomId);
    
    if (index > -1) {
        selectedSymptoms.splice(index, 1);
        cardElement.classList.remove('selected');
    } else {
        if (selectedSymptoms.length < 5) {
            selectedSymptoms.push(symptomId);
            cardElement.classList.add('selected');
        } else {
            alert('Puedes seleccionar máximo 5 síntomas.');
            return;
        }
    }
    
    updateSelectedCount();
    updateContinueButton();
}

function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = selectedSymptoms.length;
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = selectedSymptoms.length < 4;
}

function goToRefinement() {
    if (selectedSymptoms.length < 4) {
        alert('Selecciona al menos 4 síntomas para continuar.');
        return;
    }
    
    renderRefinementSymptoms();
    showScreen('refinamiento');
    
    const title = document.getElementById('refinamientoTitle');
    title.textContent = `Hola ${currentUser}, selecciona síntomas más específicos`;
}

function renderRefinementSymptoms() {
    const grid = document.getElementById('refinementGrid');
    grid.innerHTML = '';
    
    // Determinar categorías basadas en síntomas seleccionados
    const categories = getRelevantCategories();
    const relevantSymptoms = [];
    
    categories.forEach(category => {
        if (refinementSymptoms[category]) {
            relevantSymptoms.push(...refinementSymptoms[category]);
        }
    });
    
    // Mostrar máximo 5 síntomas de refinamiento
    const symptomsToShow = relevantSymptoms.slice(0, 5);
    
    symptomsToShow.forEach(symptom => {
        const card = document.createElement('div');
        card.className = 'symptom-card';
        card.dataset.symptomId = symptom.id;
        card.innerHTML = `
            <span class="symptom-icon">${symptom.icon}</span>
            <div class="symptom-text">${symptom.text}</div>
        `;
        
        card.addEventListener('click', () => toggleRefinementSymptom(symptom.id, card));
        grid.appendChild(card);
    });
}

function getRelevantCategories() {
    const categories = new Set();
    
    selectedSymptoms.forEach(symptomId => {
        const symptom = generalSymptoms.find(s => s.id === symptomId);
        if (symptom) {
            categories.add(symptom.category);
        }
    });
    
    return Array.from(categories);
}

function toggleRefinementSymptom(symptomId, cardElement) {
    const index = selectedRefinement.indexOf(symptomId);
    
    if (index > -1) {
        selectedRefinement.splice(index, 1);
        cardElement.classList.remove('selected');
    } else {
        selectedRefinement.push(symptomId);
        cardElement.classList.add('selected');
    }
}

function showDiagnosis() {
    const diagnosis = generateDiagnosis();
    currentDiagnosis = diagnosis;
    
    const title = document.getElementById('diagnosisTitle');
    const content = document.getElementById('diagnosisContent');
    const recommendations = document.getElementById('recommendations');
    
    title.textContent = diagnosis.name;
    
    content.innerHTML = `
        <div style="text-align: center; font-size: 4rem; margin-bottom: 1rem;">
            ${diagnosis.image}
        </div>
        <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Estimado/a ${currentUser}, según los síntomas que has seleccionado, 
            es posible que presentes: <strong>${diagnosis.name}</strong>
        </p>
        <p style="color: var(--text-light); margin-bottom: 1.5rem;">
            ${diagnosis.description}
        </p>
        <div style="background: rgba(231, 76, 60, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--danger-color);">
            <strong>⚠️ Importante:</strong> Esta aplicación CIBERSALUD 360 de CONAMIR es solo orientativa. 
            No reemplaza la consulta médica profesional. Te recomendamos acudir a un centro de salud 
            en Huancané o Puno para un diagnóstico preciso.
        </div>
    `;
    
    recommendations.innerHTML = generateRecommendationsHTML(diagnosis);
    
    // Guardar en historial
    saveToHistory(diagnosis);
    
    showScreen('diagnostico');
}

function generateDiagnosis() {
    // Lógica simple de diagnóstico basada en síntomas
    const allSymptoms = [...selectedSymptoms, ...selectedRefinement];
    let bestMatch = null;
    let maxScore = 0;
    
    Object.keys(diseases).forEach(diseaseKey => {
        const disease = diseases[diseaseKey];
        let score = 0;
        
        disease.symptoms.forEach(symptom => {
            if (allSymptoms.includes(symptom)) {
                score++;
            }
        });
        
        if (score > maxScore) {
            maxScore = score;
            bestMatch = disease;
        }
    });
    
    // Si no hay coincidencia clara, usar IRA como default (más común en altiplano)
    return bestMatch || diseases.ira;
}

function generateRecommendationsHTML(diagnosis) {
    const recs = diagnosis.recommendations;
    
    return `
        <div class="recommendation-grid">
            <div class="recommendation-item">
                <h5>🍽️ Alimentos Recomendados</h5>
                <ul>
                    ${recs.alimentos.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="recommendation-item">
                <h5>💪 Hábitos Saludables</h5>
                <ul>
                    ${recs.habitos.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="recommendation-item">
                <h5>🛡️ Prevención</h5>
                <ul>
                    ${recs.prevencion.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function goToDoctor() {
    if (!currentUser) {
        alert('Por favor, ingresa tu nombre primero para personalizar el mensaje.');
        showScreen('inicio');
        return;
    }
    
    const message = `Hola, soy ${currentUser} y deseo una consulta médica desde la app CIBERSALUD 360.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/51900973658?text=${encodedMessage}`;
    
    console.log('Abriendo WhatsApp:', whatsappUrl); // Para debug
    window.open(whatsappUrl, '_blank');
}

function goToDoctorFromRecommendation(diseaseName) {
    const userName = currentUser || 'Usuario';
    const message = `Hola, soy ${userName} y deseo una consulta médica sobre ${diseaseName} desde la app CIBERSALUD 360 de CONAMIR - Rosaspata, Huancané, Puno.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/51900973658?text=${encodedMessage}`;
    
    console.log('Abriendo WhatsApp desde recomendaciones:', whatsappUrl); // Para debug
    window.open(whatsappUrl, '_blank');
}

function testWhatsAppConnection() {
    const testMessage = `Hola, estoy probando la conexión desde CIBERSALUD 360 - CONAMIR Rosaspata, Huancané, Puno. ¿Está disponible el servicio de consultas médicas?`;
    const encodedMessage = encodeURIComponent(testMessage);
    const whatsappUrl = `https://wa.me/51900973658?text=${encodedMessage}`;
    
    // Mostrar confirmación antes de abrir
    if (confirm('¿Deseas abrir WhatsApp para probar la conexión con el servicio médico?\n\nNúmero: +51 900 973 658')) {
        console.log('Probando conexión WhatsApp:', whatsappUrl);
        window.open(whatsappUrl, '_blank');
        
        // Mostrar mensaje informativo
        setTimeout(() => {
            alert('✅ Si WhatsApp se abrió correctamente, la conexión está funcionando.\n\n📱 Puedes usar este número para consultas médicas reales.\n\n🏥 Recuerda que CIBERSALUD 360 es solo orientativo y no reemplaza la consulta médica profesional.');
        }, 1000);
    }
}

function newConsultation() {
    selectedSymptoms = [];
    selectedRefinement = [];
    currentDiagnosis = null;
    
    // Limpiar selecciones visuales
    document.querySelectorAll('.symptom-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    updateSelectedCount();
    updateContinueButton();
    
    showScreen('consulta');
}

function renderRecommendations() {
    const container = document.getElementById('diseaseRecommendations');
    container.innerHTML = '';
    
    Object.keys(diseases).forEach(diseaseKey => {
        const disease = diseases[diseaseKey];
        const card = document.createElement('div');
        card.className = 'disease-card';
        
        // Crear galería de imágenes ilustrativas
        const imageGallery = disease.illustrativeImages ? 
            `<div class="disease-images" style="text-align: center; margin: 1rem 0; font-size: 2rem;">
                ${disease.illustrativeImages.join(' ')}
            </div>` : '';
        
        card.innerHTML = `
            <h4>${disease.image} ${disease.name}</h4>
            <p style="margin-bottom: 1rem; color: var(--text-light);">${disease.description}</p>
            ${imageGallery}
            ${generateRecommendationsHTML(disease)}
            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(46, 125, 50, 0.05); border-radius: 8px; text-align: center;">
                <p style="margin-bottom: 1rem; font-weight: 500; color: var(--primary-color);">
                    ¿Presentas estos síntomas? Consulta con un profesional
                </p>
                <button onclick="goToDoctorFromRecommendation('${disease.name}')" class="btn-doctor" style="font-size: 0.9rem; padding: 0.8rem 1.5rem;">
                    📞 Consultar por ${disease.name}
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    grid.innerHTML = '';
    
    teamMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-member';
        
        card.innerHTML = `
            <div class="member-avatar">${member.icon}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-virtues">
                ${member.virtues.map(virtue => `<span class="virtue-badge">${virtue}</span>`).join('')}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function saveToHistory(diagnosis) {
    const historyItem = {
        date: new Date().toLocaleDateString('es-PE'),
        user: currentUser,
        diagnosis: diagnosis.name,
        symptoms: [...selectedSymptoms, ...selectedRefinement]
    };
    
    consultationHistory.unshift(historyItem);
    
    // Mantener solo las últimas 10 consultas
    if (consultationHistory.length > 10) {
        consultationHistory = consultationHistory.slice(0, 10);
    }
    
    localStorage.setItem('cibersalud_history', JSON.stringify(consultationHistory));
    renderHistory();
}

function loadHistory() {
    const saved = localStorage.getItem('cibersalud_history');
    if (saved) {
        consultationHistory = JSON.parse(saved);
    }
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyList');
    
    if (consultationHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No hay consultas previas</p>';
        return;
    }
    
    container.innerHTML = consultationHistory.map(item => `
        <div class="history-item">
            <div class="history-date">${item.date}</div>
            <div class="history-diagnosis">${item.diagnosis}</div>
            <div style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.5rem;">
                Usuario: ${item.user}
            </div>
        </div>
    `).join('');
}

function showScreen(screenName) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(`screen-${screenName}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Actualizar navegación
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[onclick="showScreen('${screenName}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Actualizar título de consulta si es necesario
    if (screenName === 'consulta' && currentUser) {
        const title = document.getElementById('consultaTitle');
        title.textContent = `Hola ${currentUser}, selecciona los síntomas que presentas`;
    }
}

// Funciones de utilidad
function formatSymptomText(symptomId) {
    const symptom = generalSymptoms.find(s => s.id === symptomId);
    return symptom ? symptom.text : symptomId;
}

// Event listeners adicionales
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'userName') {
            startConsultation();
        }
    }
});

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

// Funcionalidad PWA básica
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registrado con éxito:', registration.scope);
            })
            .catch(function(registrationError) {
                console.log('SW falló al registrarse:', registrationError);
            });
    });
}