let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    let table = '<table>';

    for (let i = 0; i < 3; i++) {
        table += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;

            let cellContent = '';
            if (fields[index] === 'circle') {
                cellContent = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                cellContent = generateCrossSVG();
            }

            table += `<td onclick="handleClick(${index})">${cellContent}</td>`;
        }

        table += '</tr>';
    }

    table += '</table>';

    // Füge den HTML-Code zur Seite hinzu
    contentDiv.innerHTML = table;

    // Überprüfe auf einen Sieg oder Unentschieden
    checkGameResult();
}

function handleClick(index) {
    // Überprüfe abwechselnd, welches Symbol einzufügen ist
    const symbol = fields.filter(field => field !== null).length % 2 === 0 ? 'circle' : 'cross';

    // Füge das Symbol in das Feld ein
    fields[index] = symbol;

    // Rufe die render-Funktion nur für das geklickte <td>-Element auf
    const contentDiv = document.getElementById('content');
    const clickedTd = contentDiv.querySelector(`[onclick="handleClick(${index})"]`);
    clickedTd.innerHTML = (symbol === 'circle') ? generateCircleSVG() : generateCrossSVG();

    // Überprüfe auf einen Sieg oder Unentschieden
    checkGameResult();
}

function checkGameResult() {
    // Überprüfe auf einen Sieg oder Unentschieden
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Reihen
        [0, 4, 8], [2, 4, 6]             // Diagonale Reihen
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        // Überprüfe, ob alle Felder in der Kombination das gleiche Symbol haben
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Markiere die gewinnenden Felder und zeige eine Linie an
            markWinningFields(combination);
            
            // Zeige eine Linie an
            drawWinningLine(combination);

            // Verzögere die Anzeige der Benachrichtigung um 500 Millisekunden (0,5 Sekunden)
            setTimeout(() => {
                resetGame();
            }, 2000);
            return;
        }
    }

    // Überprüfe auf Unentschieden
    if (!fields.includes(null)) {
        alert('Unentschieden!');
        resetGame();
    }
}

function markWinningFields(combination) {
    // Markiere die gewinnenden Felder und zeige eine Linie an
    const contentDiv = document.getElementById('content');

    for (const index of combination) {
        const winningTd = contentDiv.querySelector(`[onclick="handleClick(${index})"]`);
        winningTd.classList.add('winning-field');
    }
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    // Entferne alte Linien
    const oldLines = document.querySelectorAll('.winning-line');
    oldLines.forEach(line => line.remove());

    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    let lineAngle;

    if (startRect.left === endRect.left) {
        // Vertikale Linie
        lineAngle = Math.PI / 2; // 90 Grad im Bogenmaß
    } else {
        // Horizontale Linie
        lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
    }

    const line = document.createElement('div');
    line.className = 'winning-line'; // Füge eine Klasse für die Linien hinzu
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}

function generateCircleSVG() {
    // Definiere die Farbe, Breite und Höhe
    const color = '#00B0EF';
    const strokeWidth = 4;
    const width = 70;
    const height = 70;
    const cx = width / 2;
    const cy = height / 2;
    const r = (Math.min(width, height) - strokeWidth) / 2; // Der Radius muss die Strichstärke berücksichtigen
    const dasharray = 360;

    // SVG-Code mit Kreis und Animationspfad generieren
    const svgCode = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke="${color}" stroke-width="${strokeWidth}" cx="${cx}" cy="${cy}" r="${r}" stroke-dasharray="${dasharray}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})">
                <animate attributeName="stroke-dashoffset" values="${dasharray};0" dur="1s" repeatCount="1"></animate>
            </circle>
        </svg>
    `;

    return svgCode;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;

    const svgHtml = `
      <svg width="${width}" height="${height}">
        <line x1="0" y1="0" x2="${width}" y2="${height}"
          stroke="${color}" stroke-width="5">
          <animate attributeName="x2" values="0; ${width}" dur="0.5s" />
          <animate attributeName="y2" values="0; ${height}" dur="0.5s" />
        </line>
        <line x1="${width}" y1="0" x2="0" y2="${height}"
          stroke="${color}" stroke-width="5">
          <animate attributeName="x2" values="${width}; 0" dur="0.5s" />
          <animate attributeName="y2" values="0; ${height}" dur="0.5s" />
        </line>
      </svg>
    `;

    return svgHtml;
}

