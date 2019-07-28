const deleteButton = document.getElementById("delete-button");
const deletePopup = document.getElementById("delete-popup");
const cancelDelete = document.getElementById("cancel-delete");
const deleteBackground = document.getElementById("delete-em");
const imgLabel = document.getElementById("img-label");
const imgChoose = document.getElementById("img-choose");

if (deleteButton) {
    deleteButton.addEventListener("click", () => {
        deletePopup.classList.add("delete-popup-show");
        deleteBackground.classList.add("delete-em-show");
    })
    
}

if (cancelDelete) {
    cancelDelete.addEventListener("click", () => {
        deletePopup.classList.remove("delete-popup-show");
        deleteBackground.classList.remove("delete-em-show");
    })
}

if (imgChoose) {
    imgChoose.addEventListener("input", () => {
        if (imgChoose.value === "") {
            imgLabel.innerHTML = "Adicionar Imagem";
        } else {
            imgLabel.innerHTML = imgChoose.value;
        }
    })
}
