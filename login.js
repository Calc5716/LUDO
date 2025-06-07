let form = document.querySelector("#Structure");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let squares = document.querySelector("#squares").value;
    let pieces = document.querySelector("#pieces").value;

    if (!squares || !pieces) {
        alert("Please select both number of squares and pieces.");
        return;
    }

    localStorage.setItem('squares', squares);
    localStorage.setItem('pieces', pieces);

    window.location.href = 'ludo_index.html';
});
