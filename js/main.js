document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtn = document.getElementsByClassName("close-btn")[0];
  const saveTaskBtn = document.querySelector(".submit-btn");

  let todo = JSON.parse(localStorage.getItem("todo")) || [];
  let pending = JSON.parse(localStorage.getItem("pending")) || [];
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  let complete = JSON.parse(localStorage.getItem("complete")) || [];

  const todoBody = document.getElementById("todo-body");
  const pendingBody = document.getElementById("pending-body");
  const reviewBody = document.getElementById("review-body");
  const completeBody = document.getElementById("complete-body");

  // Function to render tasks
  function displayTasks(container, tasks) {
    container.innerHTML = ""; // Clear existing tasks

    if (tasks.length === 0) {
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No tasks available";
      container.appendChild(noDataMessage);
    } else {
      tasks.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add(
          "card-container",
          "my-4",
          "p-4",
          "rounded",
          "shadow-lg"
        );
        card.style.backgroundColor = "#fff";
        card.id = `task-${item.id}`;
        card.draggable = true;
        card.ondragstart = drag;

        card.innerHTML = `
          <div class="card">
            <h3 class="text-xl font-bold">${item.title}</h3>
            <p>${item.description}</p>
          </div>
        `;

        container.appendChild(card);
      });
    }
  }

  function displayTodoItems() {
    displayTasks(todoBody, todo);
  }

  function displayPendingItems() {
    displayTasks(pendingBody, pending);
  }

  function displayReviewItems() {
    displayTasks(reviewBody, reviews);
  }

  function displayCompleteItems() {
    displayTasks(completeBody, complete);
  }

  displayTodoItems();
  displayPendingItems();
  displayReviewItems();
  displayCompleteItems();

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

  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(data);
    const dropzone = event.target.closest(".column-body");

    // Determine the source and destination of the task
    const taskId = parseInt(data.split("-")[1]);
    let taskIndex;

    if (dropzone) {
      if (dropzone.id === "todo-body") {
        taskIndex =
          findTaskAndMove(taskId, pending, todo) ||
          findTaskAndMove(taskId, reviews, todo) ||
          findTaskAndMove(taskId, complete, todo);
      } else if (dropzone.id === "pending-body") {
        taskIndex =
          findTaskAndMove(taskId, todo, pending) ||
          findTaskAndMove(taskId, reviews, pending) ||
          findTaskAndMove(taskId, complete, pending);
      } else if (dropzone.id === "review-body") {
        taskIndex =
          findTaskAndMove(taskId, todo, reviews) ||
          findTaskAndMove(taskId, pending, reviews) ||
          findTaskAndMove(taskId, complete, reviews);
      } else if (dropzone.id === "complete-body") {
        taskIndex =
          findTaskAndMove(taskId, todo, complete) ||
          findTaskAndMove(taskId, pending, complete) ||
          findTaskAndMove(taskId, reviews, complete);
      }
    }

    displayTodoItems();
    displayPendingItems();
    displayReviewItems();
    displayCompleteItems();
  }

  function findTaskAndMove(taskId, fromArray, toArray) {
    const taskIndex = fromArray.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      const [task] = fromArray.splice(taskIndex, 1);
      toArray.push(task);
      localStorage.setItem("todo", JSON.stringify(todo));
      localStorage.setItem("pending", JSON.stringify(pending));
      localStorage.setItem("reviews", JSON.stringify(reviews));
      localStorage.setItem("complete", JSON.stringify(complete));
      return taskIndex;
    }
    return null;
  }

  window.allowDrop = allowDrop;
  window.drag = drag;
  window.drop = drop;
});
