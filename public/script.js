let liPick = document.querySelectorAll(".todoItem");

liPick.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("strike");
    })
})