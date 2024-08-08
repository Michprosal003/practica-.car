let auto = document.querySelector('.auto');
let pista = document.querySelector('.pista');
let scoreElement = document.getElementById('score');
let statusElement = document.getElementById('status');
let warningElement = document.getElementById('warning');
let dialog = document.getElementById('dialog');

let p = {
    x: window.innerWidth / 2 - 25,
    xv: 0,
    y: 450,
    yv: 0,
    r: 0
};

let tiempo = 0;
let velocidad = 0.4; // Velocidad de los autos oponentes
let velocidadAutoJugador = 20; // Velocidad rápida para el auto del jugador
let score = 0;
let gameOver = false;

let animate = () => {
    window.requestAnimationFrame(animate);

    if (gameOver) return; // Detener la animación si el juego ha terminado

    p.x += p.xv;
    p.y += p.yv;

    // Verificar si el coche está fuera de los límites y mostrar advertencia
    if (p.x + 50 > window.innerWidth || p.x < 0) {
        p.x = Math.max(0, Math.min(window.innerWidth - 50, p.x));
        warningElement.textContent = 'No puedes salir del carril';
        warningElement.style.display = 'block';
    } else if (p.y + 80 > window.innerHeight || p.y < 0) {
        p.y = Math.max(0, Math.min(window.innerHeight - 80, p.y));
        warningElement.textContent = 'No puedes salir del carril';
        warningElement.style.display = 'block';
    } else {
        warningElement.style.display = 'none'; // Ocultar advertencia si el coche está dentro del carril
    }

    auto.style.transform = `translateX(${p.x}px) translateY(${p.y}px) rotate(${p.r}deg)`;

    tiempo++;
    if (tiempo % 80 === 0) {
        let x = Math.random() * (window.innerWidth - 50); // Ajustar posición en función del ancho de la ventana
        let n = document.createElement('div');
        pista.appendChild(n);
        n.classList.add('autos');
        n.style.left = x + 'px';
        n.style.top = "-100px";
    }
    mover();
    choque();
    updateScore();
};
animate();

setInterval(() => {
    let l = document.createElement('div');
    pista.appendChild(l);
    l.classList.add('lineas');
    setTimeout(() => {
        l.remove();
    }, 1000);
}, 150);

document.addEventListener('keydown', (e) => {
    if (gameOver) return; // Ignorar las teclas si el juego ha terminado

    switch (e.code) {
        case 'ArrowLeft':
            p.xv = -velocidadAutoJugador; // Usa la velocidad del jugador
            break;
        case 'ArrowRight':
            p.xv = velocidadAutoJugador; // Usa la velocidad del jugador
            break;
        case 'ArrowUp':
            p.yv = -velocidadAutoJugador; // Usa la velocidad del jugador
            break;
        case 'ArrowDown':
            p.yv = velocidadAutoJugador; // Usa la velocidad del jugador
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (gameOver) return; // Ignorar las teclas si el juego ha terminado

    switch (e.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
            p.xv = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            p.yv = 0;
            break;
    }
    auto.style.transform = `translateX(${p.x}px) translateY(${p.y}px) rotate(${p.r}deg)`;
});

function mover() {
    let muchos = document.querySelectorAll('.autos');
    muchos.forEach((e) => {
        let currentTransform = e.style.transform || '';
        e.style.transform = currentTransform + `translateY(${velocidad}px)`;
        if (e.getBoundingClientRect().y > window.innerHeight) {
            e.remove(); // Eliminar autos que han salido de la pantalla
        }
    });
}

function choque() {
    let muchos = document.querySelectorAll('.autos');
    muchos.forEach((e) => {
        let x = e.getBoundingClientRect().x;
        let y = e.getBoundingClientRect().y;
        
        if (p.y < y + 45 && p.y + 45 > y && p.x + 45 > x && p.x < x + 50) {
            e.style.backgroundImage = 'url(explosion.png)';
            e.style.width = '100px';
            p.r = 500;
            auto.style.transformOrigin = 'center';
            gameOver = true;
            statusElement.textContent = '¡Perdiste!';
            statusElement.style.display = 'block'; // Mostrar el mensaje de estado
            dialog.style.display = 'block'; // Mostrar el cuadro de diálogo
        }
    });
}

function updateScore() {
    if (!gameOver) {
        score += 0.1; // Aumenta el puntaje con el tiempo o en función de otros eventos
        scoreElement.textContent = `Puntos: ${Math.floor(score)}`;
    }
}

document.getElementById('restart').addEventListener('click', () => {
    // Reiniciar las variables del juego
    p = {
        x: window.innerWidth / 2 - 25,
        xv: 0,
        y: 450,
        yv: 0,
        r: 0
    };

    tiempo = 0;
    velocidad = 0.4; // Velocidad de los autos oponentes
    velocidadAutoJugador = 20; // Asegúrate de reiniciar la velocidad del jugador
    score = 0;
    gameOver = false;

    // Limpiar la pista
    pista.innerHTML = '';

    // Reiniciar el auto del jugador
    auto.style.transform = `translateX(${p.x}px) translateY(${p.y}px) rotate(${p.r}deg)`;

    // Reiniciar los autos para que no impacten al auto del jugador
    let muchos = document.querySelectorAll('.autos');
    muchos.forEach((e) => e.remove());

    scoreElement.textContent = `Puntos: ${Math.floor(score)}`;
    statusElement.style.display = 'none';
    dialog.style.display = 'none';

    // Volver a iniciar la animación
    animate();
});

document.getElementById('quit').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirige a la página principal
});

// Manejar los controles móviles
document.getElementById('leftButton').addEventListener('touchstart', () => {
    p.xv = -velocidadAutoJugador;
});
document.getElementById('rightButton').addEventListener('touchstart', () => {
    p.xv = velocidadAutoJugador;
});
document.addEventListener('touchend', (e) => {
    if (gameOver) return; // Ignorar las teclas si el juego ha terminado

    if (e.target.id === 'leftButton' || e.target.id === 'rightButton') {
        p.xv = 0;
    }
});
