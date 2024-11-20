document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtn = document.getElementsByClassName("close-btn")[0];
  const saveTaskBtn = document.querySelector(".submit-btn");

  let todo = JSON.parse(localStorage.getItem("todo")) || [];

  const todoBody = document.getElementById("todo-body");

  // Function to render each todo item as a card
  function displayTodoItems() {
    todoBody.innerHTML = ""; // Clear any existing tasks

    if (todo.length === 0) {
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No todo data";
      todoBody.appendChild(noDataMessage);
    } else {
      todo.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add(
          "card-container",
          "my-4",
          "p-4",
          "rounded",
          "shadow-lg"
        );
        card.style.backgroundColor = "#fff";

        card.innerHTML = `
                <div class="card">
                <h3 class="text-xl font-bold">${item.title}</h3>
                <p>${item.description}</p>
                </div>
            `;

        todoBody.appendChild(card);
      });
    }
  }

  displayTodoItems();

  openModalBtn.onclick = function () {
    modal.style.display = "block";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
  };

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  saveTaskBtn.onclick = function (event) {
    event.preventDefault(); // Prevent form submission
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const newTask = {
      id: Date.now(), // Unique ID based on timestamp
      title: title,
      description: description,
    };
    todo.push(newTask);
    localStorage.setItem("todo", JSON.stringify(todo));
    displayTodoItems();
    modal.style.display = "none";
  };
});
