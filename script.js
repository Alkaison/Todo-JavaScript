const taskInput = document.querySelector("#taskInput");
const taskAddBtn = document.querySelector("#addSvg");
const taskContainer = document.querySelector(".task-container");
const taskField = document.querySelector(".task");
const clearAllTaskBtn = document.querySelector("#clearAllTaskBtn");

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

// remove all childs of "taskContainer" class 
clearAllTaskBtn.addEventListener("click", () => {

    if(confirm("All the tasks will be cleared permanently."))
    {
        // taskContainer.removeChild();
    }
});
