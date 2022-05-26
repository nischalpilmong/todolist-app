const taskInput = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box');
const filters = document.querySelectorAll('.filters span')
const clearAll = document.querySelector('.clear-btn');

let editId;
let isEditedTask = false;

//getting localStorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
   btn.addEventListener('click', () => {
   //console.log(btn);
   document.querySelector("span.active").classList.remove('active');
    btn.classList.add('active');
    //console.log(btn.id);
    showTodo(btn.id);
    });
});

//show the tasks in the list
function showTodo(filter){
    let li = "";
    if(todos){
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == 'completed' ? 'checked' : '';
            if(filter == todo.status || filter == 'all'){
                li += `
                <li class="task">
                  <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                  </label>
                  <div class="settings">
                    <i onclick='showMenu(this)' class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                    </ul>
                  </div>
                </li>        
                `;
            }            
       });
    }
    taskBox.innerHTML = li || `<span>You don't have any task here.</span>`;
}

//show edit and delete menu after clicking the three dot icon
function showMenu(selectedTask){
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add('show');
    document.addEventListener('click', e => {
       //removing show class from the task menu on the document click
       if(e.target.tagName != "I" || e.target != selectedTask){
           taskMenu.classList.remove('show');
       }
    });
}

//edit the task 
function editTask(taskId, taskName){
    //console.log(taskId, taskName);
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}


//delete the individual task
function deleteTask(deleteId){
    //removing selected task from todos array
    todos.splice(deleteId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo("all");
}

//remove all the tasks from the list and array
clearAll.addEventListener("click", () => {
    //removing all items of arrays
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

//update the status of task if the task is checked or not
function updateStatus(selectedTask){
    //getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    console.log(taskName);
    if(selectedTask.checked){
        taskName.classList.add('checked');
        //updating the status of selected task to completed
        todos[selectedTask.id].status = 'completed';
        //console.log(todos);
    }else{
        taskName.classList.remove('checked');
        //updating the status of selected task to pending
        todos[selectedTask.id].status = 'pending';
        //console.log(todos);
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

//inputting the task from the input tag section
taskInput.addEventListener('keyup', e => {
    e.preventDefault();
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        if(!isEditedTask){
            if(!todos){
                todos = [];
                }
                let taskInfo = {
                    name: userTask, 
                    status: 'pending'
                   };
                todos.push(taskInfo);
        }else{
            isEditedTask = false;
            todos[editId].name = userTask;
        }
       
        taskInput.value = "";
        
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");   
    }
});