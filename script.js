const taskInput = document.querySelector("#taskInput");
const taskAddBtn = document.querySelector("#addSvg");
const taskContainer = document.querySelector(".task-container");
const taskField = document.querySelector(".task");
const taskCountText = document.querySelector("#clearAllTaskText");
const clearAllTaskBtn = document.querySelector("#clearAllTaskBtn");
const taskCompletedIcon = "fa-solid fa-circle-check pendingSvg";
const taskUncompletedIcon = "fa-regular fa-circle pendingSvg";
let taskCount = 3;
const noTasksMessage = `<div class="completed">
                            <p>Add a task to plan your day.</p>
                        </div>`;

const completedTask = (task) => {

    const uncheckIcon = task.querySelector("i.pendingSvg");
    const editIcon = task.querySelector("i.editSvg");

    if(uncheckIcon.className === taskUncompletedIcon)
    {
        // update icon, disable edit 
        uncheckIcon.className = taskCompletedIcon;
        editIcon.style.display = "none";
        task.classList.add("checked");

        // shift the completed task to the end 
        const shiftTask = task.cloneNode(true);
        task.remove();
        taskContainer.append(shiftTask);

        // update task counts 
        taskCount--;
        updateTaskCount();
    }
    else
    {
        // update icon, enable edit 
        uncheckIcon.className = taskUncompletedIcon;
        editIcon.style.display = "block";
        task.classList.remove("checked");

        // update task counts 
        taskCount++;
        updateTaskCount();
    }
}

const editTaskText = (task) => {
    
    // make the task text editable 
    const editTaskText = task.querySelector(".taskText");
    editTaskText.setAttribute("contenteditable", "true");
    editTaskText.focus();

    // Listen for the blur event to detect when the user is done editing 
    editTaskText.addEventListener("blur", () => {
        // Make the task text uneditable 
        editTaskText.setAttribute("contenteditable", "false");
  });
}

// delete the task when clicked on deleteIcon 
const deleteTask = (task) => {
    // remove the task from the list  
    task.remove();

    // update task counts 
    taskCount--;
    updateTaskCount();
};

const addNewTask = () => {
    // get input field value 
    const newTask = taskInput.value;

    if (newTask !== '' && newTask.length >= 5) {
        // cloning the structure of tasks 
        const newTaskField = taskField.cloneNode(true);

        // select the task text field 
        const newTaskText = newTaskField.querySelector(".taskText");
        newTaskText.textContent = newTask;

        // append the task and empty the inputBox value 
        taskContainer.append(newTaskField);
        taskInput.value = '';

        // update task counts 
        taskCount++;
        updateTaskCount();
    }
    else
        alert("Task must be of at least 5 characters to be registered.");

    // focus the input box for typing 
    taskInput.focus();
}

// add the task when clicked plusIcon 
taskAddBtn.addEventListener("click", addNewTask);

// add the task when pressed Enter key 
taskInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
        addNewTask();
});

// check which task is clicked and which button is clicked 
taskContainer.addEventListener("click", (e) => {
    // select the particular task 
    const taskElement = e.target.parentElement;

    if(taskElement.classList.contains("task"))
    {
        e.stopPropagation(); // Stop immediate propagation of the click event 

        // get the data value of clicked element 
        const clickedElement = e.target;
        const data = clickedElement.getAttribute("data");

        switch(data)
        {
            case 'check':
                completedTask(taskElement);
                break;
            case 'task':
                // does nothing for now 
                break;
            case 'edit':
                editTaskText(taskElement);
                break;
            case 'delete':
                deleteTask(taskElement);
                break;
        }
    }
});

// update the count of pending tasks 
const updateTaskCount = () => {

    // reset the taskCount 
    if(taskCount < 0)
        taskCount = 0;

    // check whether all tasks completed 
    if(taskCount === 0)
        taskCountText.textContent = `Mission Accomplished!`;
    else
        taskCountText.textContent = `You have ${taskCount} pending tasks`;

    // check for no tasks in list 
    if(taskCount < 2)
        updateNoTaskMessage();
}

// add the message when no tasks are listed 
const updateNoTaskMessage = () => {

    // if there's nothing in task-container, show the message 
    if(taskContainer.childElementCount === 0)
        taskContainer.setHTML(noTasksMessage);
    else if(taskCount === 1)
    {
        try {
            const removeMessage = taskContainer.querySelector(".completed");
            removeMessage.remove();
        }
        catch(error) {
            // do nothing :) 
        }
    }
}

// remove all childs of "taskContainer" class 
clearAllTaskBtn.addEventListener("click", () => {

    // ask for confirmation 
    if(confirm("All the tasks will be cleared permanently."))
    {
        taskContainer.setHTML('');

        // update task counts 
        taskCount = 0;
        updateTaskCount();

        // focus the input box for typing 
        taskInput.focus();
    }
});
