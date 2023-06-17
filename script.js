const taskInput = document.querySelector("#taskInput");
const taskAddBtn = document.querySelector("#addSvg");
const taskContainer = document.querySelector(".task-container");
const taskField = document.querySelector(".task");
const inValidTaskLength = document.querySelector(".task-length-error");
const taskCountText = document.querySelector("#clearAllTaskText");
const filterSelected = document.querySelector("#filter-list");
const clearAllTaskBtn = document.querySelector("#clearAllTaskBtn");
const taskCompletedIcon = "fa-solid fa-circle-check pendingSvg";
const taskUncompletedIcon = "fa-regular fa-circle pendingSvg";

// task counter for stating the number of pending tasks 
let taskCount = 3;

// this is message is to shown when there's no tasks inside container 
const noTasksMessage = `<div class="completed">
                            <p>Add a task to plan your day.</p>
                        </div>`;

// if user clicked on uncheck or check icon, format the task accordingly 
const completedTask = (task) => {
    const uncheckIcon = task.querySelector("i.pendingSvg");
    const editIcon = task.querySelector("i.editSvg");
    const taskId = Number.parseInt(task.getAttribute("taskid"));
    const isTaskCompleted = uncheckIcon.className === taskUncompletedIcon;

    // Update icon, text, and edit display using a conditional operator 
    uncheckIcon.className = isTaskCompleted ? taskCompletedIcon : taskUncompletedIcon;
    editIcon.style.display = isTaskCompleted ? "none" : "block";
    task.classList.toggle("checked", isTaskCompleted);

    // Update the localStorage data 
    updateTaskStatus(isTaskCompleted, taskId);

    // Update task count 
    taskCount += isTaskCompleted ? -1 : 1;
    updateTaskCount();
};

// edit the task text when clicked on editIcon 
const editTaskText = (task) => {
    
    // make the task text editable 
    const editTaskText = task.querySelector(".taskText");
    const previousTaskText = editTaskText.textContent;
    editTaskText.setAttribute("contenteditable", "true");
    editTaskText.focus();

    // Listen for the blur event to detect when the user is done editing 
    editTaskText.addEventListener("blur", (e) => {

        // Make the task text uneditable 
        editTaskText.setAttribute("contenteditable", "false");

        // remove unwanted spaces 
        editTaskText.textContent = editTaskText.textContent.trim();

        // if the newTaskText is less than 5 characters, then update to prevoius task text 
        if(editTaskText.textContent === '' || editTaskText.textContent.length < 5)
        {
            editTaskText.textContent = previousTaskText;
        }

        // update task text in storage 
        updateTaskTextInStorage(task);
    });
}

// delete the task when clicked on deleteIcon 
const deleteTask = (task) => {
    
    // delete task from storage 
    deleteTaskFromStorage(task);

    // remove the task from the list 
    task.remove();

    // update task counts 
    taskCount--;
    updateTaskCount();
};

// add new task to the list when clicked on plusIcon or pressed Enter key 
const addNewTask = () => {

    // reset the error message 
    inValidTaskLength.style.display = "none";
    taskInput.style.border = "1.5px solid gray";

    // get input field value and remove unwanted spaces 
    const newTask = taskInput.value.trim();

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

        // add the task data to localStorage 
        addNewTaskToLocalStorage(newTaskField);
    }
    else
    {
        inValidTaskLength.style.display = "block";
        taskInput.style.border = "1.5px solid red";
    }

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
                // do nothing :) 
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

    // check if noTasksMessage can be added 
    if(taskCount < 2)
        updateNoTaskMessage();
}

// add the message when no tasks are listed 
const updateNoTaskMessage = () => {

    // if there's nothing in task-container, show the message 
    if(taskContainer.childElementCount === 0)
        taskContainer.innerHTML = noTasksMessage;
    else if(taskCount === 1)
    {
        try {
            // if newTask is added remove the noTasksMessage 
            const removeMessage = taskContainer.querySelector(".completed");
            removeMessage.remove();
        }
        catch(error) {
            console.log(`${error}`);
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

        // format the localStorage for tasks data 
        localStorage.setItem("tasks", JSON.stringify([]));
    }
});

// get data from local storage 
const loadData = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    return tasks ? tasks : [];
}

// list the tasks from storage 
const listTasksFromStorage = () => {
    
    // get data from local storage 
    const tasksData = loadData();
    taskCount = 0;

    // clear the task-container 
    taskContainer.innerHTML = '';

    // list down the tasks 
    for(const task of tasksData)
    {
        const newTaskField = taskField.cloneNode(true);

        // select the task text field and the text from storage 
        const newTaskText = newTaskField.querySelector(".taskText");
        newTaskText.textContent = task.text;

        // if true add the checked class 
        if(task.completed)
        {
            newTaskField.classList.add("checked");
            const uncheckIcon = newTaskField.querySelector("i.pendingSvg");
            uncheckIcon.className = taskCompletedIcon;
        }
        else
            taskCount++;
        
        // add taskid to tasks 
        newTaskField.setAttribute("taskid", task.id);

        // append the task 
        taskContainer.append(newTaskField);
    }

    // update the taskCount 
    updateTaskCount();
}

// list only active tasks 
const listActiveTask = () => {

    // get data from local storage 
    const tasksData = loadData();
    taskCount = 0;

    // clear the task-container 
    taskContainer.innerHTML = '';

    // list down the tasks 
    for(const task of tasksData)
    {
        // if the task is incomplete list it 
        if(!task.completed)
        {
            const newTaskField = taskField.cloneNode(true);

            // select the task text field and the text from storage 
            const newTaskText = newTaskField.querySelector(".taskText");
            newTaskText.textContent = task.text;

            // add taskid to tasks 
            newTaskField.setAttribute("taskid", task.id);

            // append the task 
            taskContainer.append(newTaskField);

            taskCount++;
        }
    }
    // update the taskCount 
    updateTaskCount();
}

// list completed Tasks 
const listCompletedTasks = () => {

    // get data from local storage 
    const tasksData = loadData();

    // clear the task-container 
    taskContainer.innerHTML = '';

    // list down the tasks 
    for(const task of tasksData)
    {
        // if the task is incomplete list it 
        if(task.completed)
        {
            const newTaskField = taskField.cloneNode(true);

            // select the task text field and the text from storage 
            const newTaskText = newTaskField.querySelector(".taskText");
            newTaskText.textContent = task.text;

            // add taskid to tasks 
            newTaskField.setAttribute("taskid", task.id);

            // change the sign to checked 
            newTaskField.classList.add("checked");
            const uncheckIcon = newTaskField.querySelector("i.pendingSvg");
            uncheckIcon.className = taskCompletedIcon;

            // append the task 
            taskContainer.append(newTaskField);
        }
    }

    // update the taskCount 
    taskCount = 0;
    updateTaskCount();
}

// add initial tasks to the local storage 
const executeOnceOnVisit = () => {

    // function to add initial tasks data if visited first time 
    const addInitialTasks = () => {
        // initial 3 tasks data 
        const initialTasks = [
            {
                id: 1,
                text: "Follow @Alkaison on Twitter",
                completed: false
            },
            {
                id: 2,
                text: "Complete the first task",
                completed: false
            },
            {
                id: 3,
                text: "Thank you for visiting here",
                completed: false
            }
        ];
        localStorage.setItem("tasks", JSON.stringify(initialTasks));
        localStorage.setItem("firstVisit", true);
        localStorage.setItem("taskId", 3);
    }

    // check if the user came first time 
    const firstVisit = localStorage.getItem("firstVisit");

    if(!firstVisit)
        addInitialTasks();
    else
        listTasksFromStorage();
}

// execute on first visit 
executeOnceOnVisit();

// generate new taskID 
const getNewTaskID = () => {
    let currentTaskID = localStorage.getItem("taskId");
    currentTaskID++;
    localStorage.setItem("taskId", currentTaskID);
    return currentTaskID;
}

// add new Task data to local storage 
const addNewTaskToLocalStorage = (newTaskData) => {

    // select task text and add the taskId 
    const taskText = newTaskData.querySelector(".taskText").textContent;
    taskId = getNewTaskID();
    newTaskData.setAttribute("taskid", taskId);

    // load existing data from localStorage 
    const tasksData = loadData();

    const newData = {
        id: taskId,
        text: taskText,
        completed: false
    }

    // add the data and update localStorage 
    tasksData.push(newData);
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// delete data from localStorage 
const deleteTaskFromStorage = (deleteTask) => {
    
    // get data from local storage 
    const tasksData = loadData();

    // get task id from task-element 
    const ID = deleteTask.getAttribute("taskid");

    // filter and remove the task id data from storage 
    const newTasksData = tasksData.filter((task) => task.id != ID);

    // update the localStorage data 
    localStorage.setItem("tasks", JSON.stringify(newTasksData));
}

// task completed or not 
const updateTaskStatus = (status, taskId) => {

    // get data from local storage 
    const tasksData = loadData();

    // update status of task 
    for(const task of tasksData)
    {
        if(task.id === taskId)
        {
            task.completed = status;
        }
    }

    // update the data at local storage 
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// update task text into local storage 
const updateTaskTextInStorage = (task) => {

    // get data from local storage 
    const tasksData = loadData();

    // select task text 
    const taskText = task.querySelector(".taskText").textContent;

    const taskId = Number.parseInt(task.getAttribute("taskid"));

    // update text of task 
    for(const task of tasksData)
    {
        if(task.id === taskId)
        {
            task.text = taskText;
        }
    }

    // update the data at local storage 
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// filter the tasks as All, Active, completed 
filterSelected.addEventListener("change", (e) => {
    
    // get the selected value 
    const filterValue = e.target.value;

    // execute functions as per value 
    switch(filterValue)
    {
        case "all":
            listTasksFromStorage();
            break;
        case "active":
            listActiveTask();
            break;
        case "completed":
            listCompletedTasks();
            break;
        default:
            // do nothing :) 
    }
});
