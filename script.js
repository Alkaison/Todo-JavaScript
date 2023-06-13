const taskInput = document.querySelector("#taskInput");
const taskAddBtn = document.querySelector("#addSvg");
const taskContainer = document.querySelector(".task-container");
const taskField = document.querySelector(".task");
const clearAllTaskBtn = document.querySelector("#clearAllTaskBtn");
const taskCompletedIcon = "fa-solid fa-circle-check pendingSvg";
const taskUncompletedIcon = "fa-regular fa-circle pendingSvg";

const completedTask = (task) => {

    // if the task sign is uncheck then check it, visa-versa
    task.className = task.className === taskUncompletedIcon ? taskCompletedIcon : taskUncompletedIcon;
}

const editTaskText = (task) => {
    
    // make the task text editable 
    const editTaskText = taskElement.querySelector(".taskText"); 
    editTaskText.setAttribute("contenteditable", "true");
}

// add the task when click 
taskAddBtn.addEventListener("click", () => {
    // get input field value 
    const newTask = taskInput.value;

    if(newTask !== '' && newTask.length >= 5)
    {
        // cloning the structure of tasks 
        const newTaskField = taskField.cloneNode(true);

        // select the task text field 
        const newTaskText = newTaskField.querySelector(".taskText");
        newTaskText.textContent = newTask;

        taskContainer.append(newTaskField);

        taskInput.value = '';
    }
    else
        alert("Task must be of at least 5 characters to be registered.");

});

// check which task is clicked and which button is clicked 
taskContainer.addEventListener("click", (e) => {
    // select the particular task 
    const taskElement = e.target.parentElement;

    if(taskElement.classList.contains("task"))
    {
        // get the data value of clicked element 
        const clickedElement = e.target;
        const data = clickedElement.getAttribute("data");;

        switch(data)
        {
            case 'check':
                completedTask(clickedElement);
                break;
            case 'task':
                break;
            case 'edit':
                editTaskText(clickedElement);
                break;
            case 'delete':
                break;
        }
    }
});

// remove all childs of "taskContainer" class 
clearAllTaskBtn.addEventListener("click", () => {

    if(confirm("All the tasks will be cleared permanently."))
    {
        // taskContainer.removeChild();
    }
});
