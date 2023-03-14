const toDoList = document.querySelector(".tasks");

var isEditing = false;

var indexEdit = 0;

var visionEnCours = "";

let tasks = window.localStorage.getItem("tasks")
  ? JSON.parse(window.localStorage.getItem("tasks"))
  : [];

// add a task to the to do list
function addTask() {
  let taskText = document.querySelector(".task").value;
  if (tasks.find((el) => el.text === taskText)) {
    window.alert("This task already exist");
    document.querySelector(".task").value = "";
  } else {
    if (taskText != "") {
      // Remove space before and after the task
      taskText = taskText.trim();

      // Creation of the object task
      let task = {
        text: taskText,
        checked: false,
      };
      tasks.push(task);
      window.localStorage.setItem("tasks", JSON.stringify(tasks));
      showTasks(visionEnCours);
      document.querySelector(".task").value = "";
    }
  }
}

// display the task according to the view we want
function showTasks(clikedElement) {
  toDoList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].text = tasks[i].text.trim();
    let li = document.createElement("li");

    let all = "";
    let pending = "";
    let completed = "";

    let menu = ` 
          <span class="ellipsis"><i class="fa-solid fa-ellipsis" onclick="showMenu(this)"></i></span>
          <div class="menu">
            <ul class="menu-setting">
              <li id="delete" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i>delete</li>
              <li id="edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i>edit</li>
            </ul>
          </div>
`;

    if (tasks[i].checked) {
      completed = `
          <input type="checkbox" onclick="updateTask(this)" checked/>
          <span class="task-text"><strike>${tasks[i].text}</strike></span>`;

      all = completed;
    } else {
      pending = `
          <input type="checkbox" onclick="updateTask(this)" />
          <span class="task-text">${tasks[i].text}</span>`;

      all = pending;
    }

    if (clikedElement == "toutes") {
      li.innerHTML = all;
      li.innerHTML += menu;
      toDoList.appendChild(li);
    } else if (pending != "" && clikedElement == "en-cours") {
      li.innerHTML = pending;
      li.innerHTML += menu;
      toDoList.appendChild(li);
    } else if (completed != "" && clikedElement == "realisees") {
      li.innerHTML = completed;
      li.innerHTML += menu;
      toDoList.appendChild(li);
    }
  }
}

// Display the menu when an ellipsis is clicked
function showMenu(clikedElement) {
  // Get the ul section according to the ellipsis clicked
  let menu =
    clikedElement.parentElement.parentElement.lastElementChild
      .firstElementChild;
  menu.classList.add("show");
  // If we click on anything other than an ellipsis or the menu display, the menu is hidden
  document.addEventListener("click", (event) => {
    if (event.target.tagName != "I" || event.target != clikedElement) {
      menu.classList.remove("show");
    }
  });
}

// Crosses the task when the checkbox is checked
function updateTask(clikedElement) {
  // Get the task related to the checkbox
  let task = clikedElement.parentElement.querySelector(".task-text");
  let text = task.textContent;
  // Find the index of task into the tasks array
  let index = tasks.findIndex((el) => el.text === text);
  task.textContent = "";
  if (clikedElement.checked) {
    tasks[index].checked = true;
    task.innerHTML = `<strike>${text}</strike>`;
  } else {
    tasks[index].checked = false;
    task.innerHTML = `${text}`;
  }
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  showTasks(visionEnCours);
}

// Edit the task
function editTask(clikedElement) {
  isEditing = true;
  // Get the task related to the clicked menu
  let task =
    clikedElement.parentElement.parentElement.parentElement.querySelector(
      ".task-text"
    ).innerText;
  document.querySelector(".text-bar input").value = `${task}`;
  indexEdit = tasks.findIndex((el) => el.text === `${task}`);
  if (isEditing) {
    document.querySelector(".submit").addEventListener("click", () => {
      let newTask = document.querySelector(".text-bar input").value;
      editTextChangeTask(indexEdit, task, newTask);
    });
  }
}

// Function for the editTask function, set the new value for the task we want to edit
function editTextChangeTask(index, oldTask, newTask) {
  if (tasks.find((el) => el.text === newTask)) {
    window.alert("This task already exist");
    document.querySelector(".task").value = oldTask;
  } else {
    if (newTask != "") {
      tasks[index].text = newTask;
      window.localStorage.setItem("tasks", JSON.stringify(tasks));
      showTasks(visionEnCours);
      document.querySelector(".task").value = "";
      isEditing = false;
    }
  }
}

// Delete the task
function deleteTask(clikedElement) {
  // Get the task related to the clicked menu
  let task =
    clikedElement.parentElement.parentElement.parentElement.querySelector(
      ".task-text"
    ).innerText;
  let index = tasks.findIndex((el) => el.text === task);
  // Remove the task to the tasks array
  tasks.splice(index, 1);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  showTasks(visionEnCours);
}

// Change the focus between the three button, "Toutes", "A faire" and "Réalisées"
function changeFocus(clikedElement) {
  visionEnCours = clikedElement;
  document.querySelector(".toutes").classList.remove("focus");
  document.querySelector(".en-cours").classList.remove("focus");
  document.querySelector(".realisees").classList.remove("focus");
  document.querySelector("." + clikedElement).classList.add("focus");
}

document.querySelector(".submit").addEventListener("click", () => {
  if (isEditing === false) {
    addTask();
  }
});

document.querySelector(".clear").addEventListener("click", () => {
  tasks = [];
  window.localStorage.removeItem("tasks");
  showTasks(visionEnCours);
});

window.onload = function () {
  visionEnCours = "toutes";
  showTasks(visionEnCours);
  changeFocus(visionEnCours);
};
