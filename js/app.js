// ==========================================
// OPTISKILL - LENS SIMULATOR
// ==========================================

class GameState {
    constructor() {
        this.puntos = 0;
        this.nivel = 1;
        this.progresoTallado = 0;
        this.racha = 0;
        this.isTallando = false;
        this.interval = null;
        this.logros = new Set();
        this.talladosCompletados = 0;
        this.loadFromStorage();
    }

    loadFromStorage() {
        const saved = localStorage.getItem('optiskill-state');
        if (saved) {
            const data = JSON.parse(saved);
            this.puntos = data.puntos || 0;
            this.nivel = data.nivel || 1;
            this.racha = data.racha || 0;
            this.logros = new Set(data.logros || []);
            this.talladosCompletados = data.talladosCompletados || 0;
        }
    }

    saveToStorage() {
        const data = {
            puntos: this.puntos,
            nivel: this.nivel,
            racha: this.racha,
            logros: Array.from(this.logros),
            talladosCompletados: this.talladosCompletados
        };
        localStorage.setItem('optiskill-state', JSON.stringify(data));
    }
}

// Estados del juego
const NIVELES = [
    {
        id: 1,
        nombre: "Desbastado de CR-39",
        material: "CR-39",
        descripcion: "Material estándar. Ideal para principiantes.",
        puntosBase: 50,
        velocidadTallado: 1
    },
    {
        id: 2,
        nombre: "Tallado de Policarbonato",
        material: "Policarbonato",
        descripcion: "Material más duro. Mayor precisión requerida.",
        puntosBase: 100,
        velocidadTallado: 0.8
    },
    {
        id: 3,
        nombre: "Pulido de Trivex",
        material: "Trivex",
        descripcion: "Material de alto desempeño. Experto requerido.",
        puntosBase: 150,
        velocidadTallado: 0.6
    },
    {
        id: 4,
        nombre: "Corte de Vidrio óptico",
        material: "Vidrio óptico",
        descripcion: "Máxima dificultad. Solo para maestros.",
        puntosBase: 250,
        velocidadTallado: 0.4
    }
];

const LOGROS = {
    'primera-lente': { nombre: '🎯 Primera Lente', desc: 'Completa tu primer tallado' },
    'maestro-cr39': { nombre: '✨ Maestro CR-39', desc: 'Domina 5 lentes de CR-39' },
    'racha-5': { nombre: '🔥 Racha de 5', desc: 'Completa 5 lentes seguidos' },
    'puntos-500': { nombre: '💎 500 Puntos', desc: 'Acumula 500 puntos' },
    'nivel-4': { nombre: '👑 Maestro Absoluto', desc: 'Alcanza el Nivel 4' },
    'perfecta': { nombre: '⭐ Lente Perfecta', desc: 'Logra 100% de precisión' }
};

// Estado global
let gameState = new GameState();

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

function startTallado() {
    if (gameState.isTallando) return;
    
    gameState.isTallando = true;
    document.getElementById('lens').classList.add('tallando');
    document.getElementById('log').innerText = "⚙️ Tallando... Mantén la presión constante.";
    document.getElementById('log').classList.remove('success', 'error');
    
    const nivelConfig = NIVELES[gameState.nivel - 1];
    
    gameState.interval = setInterval(() => {
        if (gameState.progresoTallado < 100) {
            gameState.progresoTallado += 1 * nivelConfig.velocidadTallado;
            
            // Actualizar UI
            document.getElementById('progress-text').innerText = Math.floor(gameState.progresoTallado) + "%";
            document.getElementById('progress-bar').style.width = Math.floor(gameState.progresoTallado) + "%";
            
            // Efecto visual
            const opacity = Math.min(gameState.progresoTallado / 100, 0.8);
            document.getElementById('surface').style.backgroundColor = `rgba(0, 212, 255, ${opacity})`;
            
            // Partículas
            crearParticula();
        }
    }, 50);
}

function stopTallado() {
    gameState.isTallando = false;
    document.getElementById('lens').classList.remove('tallando');
    clearInterval(gameState.interval);
    document.getElementById('log').innerText = "⏸️ Proceso pausado. Revisa la superficie.";
}

function crearParticula() {
    if (Math.random() > 0.7) return; // 30% de probabilidad
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = x + '%';
    particle.style.top = y + '%';
    
    document.getElementById('particles').appendChild(particle);
    
    setTimeout(() => particle.remove(), 500);
}

function completarPrueba() {
    const precision = Math.floor(gameState.progresoTallado);
    const nivelConfig = NIVELES[gameState.nivel - 1];
    
    if (precision < 90) {
        document.getElementById('log').innerText = `❌ Lente incompleta (${precision}%). Necesitas mínimo 90%.`;
        document.getElementById('log').classList.add('error');
        gameState.racha = 0;
        return;
    }
    
    // Calcular puntos
    let puntosGanados = nivelConfig.puntosBase;
    if (precision === 100) puntosGanados *= 1.5; // Bonus por precisión perfecta
    puntosGanados += gameState.racha * 10; // Bonus por racha
    
    gameState.puntos += Math.floor(puntosGanados);
    gameState.racha += 1;
    gameState.talladosCompletados += 1;
    
    // Mensaje de éxito
    let mensaje = `✅ ¡Excelente! Lente completada (${precision}%). +${Math.floor(puntosGanados)} pts.`;
    if (precision === 100) mensaje += " 🌟 ¡PERFECCIÓN!";
    if (gameState.racha > 1) mensaje += ` 🔥 Racha x${gameState.racha}`;
    
    document.getElementById('log').innerText = mensaje;
    document.getElementById('log').classList.add('success');
    
    // Verificar logros
    verificarLogros();
    actualizarInterfaz();
    verificarAscenso();
    gameState.saveToStorage();
    
    // Resetear después de 2 segundos
    setTimeout(() => resetLente(), 2000);
}

function verificarAscenso() {
    if (gameState.puntos >= 100 * gameState.nivel && gameState.nivel < NIVELES.length) {
        gameState.nivel += 1;
        const nuevoNivel = NIVELES[gameState.nivel - 1];
        
        alert(`🎉 ¡NIVEL ${gameState.nivel} DESBLOQUEADO!\n${nuevoNivel.nombre}\n${nuevoNivel.descripcion}`);
        
        document.getElementById('task-title').innerText = nuevoNivel.nombre;
        document.getElementById('task-desc').innerText = nuevoNivel.descripcion;
        
        desbloquearLogro('nivel-' + gameState.nivel);
        actualizarInterfaz();
    }
}

function resetLente() {
    gameState.progresoTallado = 0;
    document.getElementById('progress-text').innerText = "0%";
    document.getElementById('progress-bar').style.width = "0%";
    document.getElementById('surface').style.backgroundColor = `rgba(0, 212, 255, 0.1)`;
    document.getElementById('particles').innerHTML = '';
    document.getElementById('log').innerText = "🔄 Lente reiniciada. ¡Comienza de nuevo!";
    document.getElementById('log').classList.remove('success', 'error');
}

function actualizarInterfaz() {
    document.getElementById('user-points').innerText = gameState.puntos;
    document.getElementById('user-level').innerText = gameState.nivel;
    document.getElementById('user-streak').innerText = gameState.racha;
}

function verificarLogros() {
    // Primera lente
    if (gameState.talladosCompletados === 1) {
        desbloquearLogro('primera-lente');
    }
    
    // Maestro CR-39
    if (gameState.nivel === 1 && gameState.talladosCompletados >= 5) {
        desbloquearLogro('maestro-cr39');
    }
    
    // Racha de 5
    if (gameState.racha >= 5) {
        desbloquearLogro('racha-5');
    }
    
    // 500 puntos
    if (gameState.puntos >= 500) {
        desbloquearLogro('puntos-500');
    }
    
    // Lente perfecta
    if (Math.floor(gameState.progresoTallado) === 100) {
        desbloquearLogro('perfecta');
    }
}

function desbloquearLogro(id) {
    if (!gameState.logros.has(id)) {
        gameState.logros.add(id);
        mostrarLogro(id);
        gameState.saveToStorage();
    }
}

function mostrarLogro(id) {
    const logro = LOGROS[id];
    if (!logro) return;
    
    const container = document.getElementById('achievements');
    const element = document.createElement('div');
    element.className = 'achievement';
    element.innerText = `${logro.nombre} - ${logro.desc}`;
    container.appendChild(element);
    
    // Remover después de 5 segundos
    setTimeout(() => element.remove(), 5000);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

window.onload = () => {
    // Cargar nombre
    let nombre = localStorage.getItem('optiskill-username') || 'INVITADO';
    
    if (!localStorage.getItem('optiskill-username')) {
        nombre = prompt("🎯 Bienvenido al Taller OptiSkill\nIngresa tu nombre de Maestro Tallador:") || 'INVITADO';
        localStorage.setItem('optiskill-username', nombre);
    }
    
    document.getElementById('user-name').innerText = nombre.toUpperCase();
    actualizarInterfaz();
    
    // Actualizar nivel
    const nivelActual = NIVELES[gameState.nivel - 1];
    document.getElementById('task-title').innerText = nivelActual.nombre;
    document.getElementById('task-desc').innerText = nivelActual.descripcion;
};
