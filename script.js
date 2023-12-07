let fields = [
    null,
    'circle',
    'cross',
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

// Funktion zum Rendern des Spielbretts
function render() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    let table = '<table>';

    for (let i = 0; i < 3; i++) {
        table += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;

            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = 'o';
            } else if (fields[index] === 'cross') {
                symbol = 'x';
            }
            table += `<td>${symbol}</td>`;
        }

        table += '</tr>';
    }

    table += '</table>';

    // Füge den HTML-Code zur Seite hinzu
    contentDiv.innerHTML = table;
}
