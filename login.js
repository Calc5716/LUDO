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

    if (squares === "13") {
        window.location.href = "./index(13).html";
    } else if (squares === "11") {
        window.location.href = "./index(11).html";
    } else if (squares === "9") {
        window.location.href = "./index_9.html";
    } else if (squares === "7") {
        window.location.href = "./index_7.html";
    }
});
