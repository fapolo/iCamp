const deleteButton = document.getElementById("delete-button");
const deletePopup = document.getElementById("delete-popup");
const cancelDelete = document.getElementById("cancel-delete");
const deleteBackground = document.getElementById("delete-em");

deleteButton.addEventListener("click", () => {
    deletePopup.classList.add("delete-popup-show");
    deleteBackground.classList.add("delete-em-show");
})

cancelDelete.addEventListener("click", () => {
    deletePopup.classList.remove("delete-popup-show");
    deleteBackground.classList.remove("delete-em-show");
})