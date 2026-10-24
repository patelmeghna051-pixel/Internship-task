
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const addButton = document.getElementById("addButton");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "all";
let editingId = null;

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Add a new task or save an edited task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    if (editingId !== null) {
        tasks = tasks.map(function (task) {
            if (task.id === editingId) {
                return { ...task, text: text };
            }
            return task;
        });

        editingId = null;
        addButton.textContent = "+ Add Task";
    } else {
        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });
    }

    taskInput.value = "";
    saveTasks();
    renderTasks();
});

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = tasks.filter(function (task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    visibleTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            taskInput.value = task.text;
            editingId = task.id;
            addButton.textContent = "Save Task";
            taskInput.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            if (editingId === task.id) {
                editingId = null;
                taskInput.value = "";
                addButton.textContent = "+ Add Task";
            }

            saveTasks();
            renderTasks();
        });

        actions.append(editButton, deleteButton);
        li.append(checkbox, taskText, actions);
        taskList.appendChild(li);
    });

    // Update statistics
    document.getElementById("totalTasks").textContent = tasks.length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;

    // Show or hide empty message
    emptyMessage.style.display =
        visibleTasks.length === 0 ? "block" : "none";

    // Show Clear Completed only when needed
    document.getElementById("clearCompleted").style.display =
        tasks.some(task => task.completed) ? "inline-block" : "none";
}

// Filter buttons
document.querySelectorAll(".filter").forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

// Remove all completed tasks
document.getElementById("clearCompleted").addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});

// Display the current year is not required for this app.
// Load saved tasks when the page opens.
renderTasks();
