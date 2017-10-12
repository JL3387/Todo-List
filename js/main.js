'use strict'

let usersTodo = document.getElementById("new-todo");
let addButton = document.getElementById("addButton");
let incompleteTodo = document.getElementById("todoList");
let completeTodo = document.getElementById("completedTodos");
let clearListButton = document.getElementById("clearList");
let todoListVal = [];
let completeTodoListVal = [];

//Check if the users browser supports localStorage
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

if (storageAvailable('localStorage')) {
  console.log("local storage is enabled");
}
else {
	console.warn("Your browser doesn't support local storage any list you make wont be saved");
}

if(!localStorage.getItem('todoLi') || !localStorage.getItem('completedTodoLi')){
  getLi();
} else {
  setLi();
}

//get li items to be stored in localStorage
function getLi(){
  let ulTodo = document.getElementById("todoList");
  let liTodo = ulTodo.getElementsByTagName("li");

  let ulCompleteTodo = document.getElementById("completedTodos");
  let liCompleteTodo = ulCompleteTodo.getElementsByTagName("li");
  //everytime a list is upadated the orginal array of li is deleted and the new one is asigned
  todoListVal.splice(0, todoListVal.length);
  todoListVal.push(ulTodo.innerHTML);

  completeTodoListVal.splice(0, completeTodoListVal.length);
  completeTodoListVal.push(ulCompleteTodo.innerHTML);
  //turn the HTML code into a string that is supported by "setItem"
  localStorage.setItem("todoLi", JSON.stringify(todoListVal));
  localStorage.setItem("completedTodoLi", JSON.stringify(completeTodoListVal));

}
//retrieve li to be displayed
function setLi(){
  //turn localStorage li back into html
  let savedTodoLi = JSON.parse(localStorage.getItem("todoLi"));
  let savedCompleteTodoLi = JSON.parse(localStorage.getItem("completedTodoLi"));

  document.getElementById("todoList").innerHTML = savedTodoLi;
  document.getElementById("completedTodos").innerHTML = savedCompleteTodoLi;


}

//Create the user's new ToDo element
function createToDo(usersString){

  let li = document.createElement("li");     // create <li>

  let checkbox = document.createElement("input");     // create <input>
  checkbox.setAttribute("type", "checkbox");

  let label = document.createElement("label");    // create <label>

  let editInput = document.createElement("input");
  editInput.setAttribute("type", "text");

  let editbutton = document.createElement("button");      // create <button>
  editbutton.setAttribute("class", "editButton")

  let editbuttonimage = document.createElement("img");    // create <img> for the edit <button>
  editbuttonimage.setAttribute("class", "edit");
  editbuttonimage.setAttribute("src", "imgs/edit.svg");
  editbuttonimage.setAttribute("alt", "Edit button");

  let deletebutton = document.createElement("button");      // create <button>
  deletebutton.setAttribute("class", "deleteButton");

  let deletebuttonimage = document.createElement("img");      // create <img> for the delete <button>
  deletebuttonimage.setAttribute("class", "delete");
  deletebuttonimage.setAttribute("src", "imgs/delete.svg");
  deletebuttonimage.setAttribute("alt", "Delete button");

  label.innerText = usersString;      // insert text into label
  editbutton.appendChild(editbuttonimage);      // insert <img> into <button>
  deletebutton.appendChild(deletebuttonimage);  // insert <img> into <button>

  //add all elements to li
  let elements = [checkbox, label, editInput, editbutton, deletebutton];
  for(let i = 0; i < elements.length; i++) {
    li.appendChild(elements[i]);
  }
  return li;
}

function addTodo(){
  //check if add todo isn't empty and can only accept alphanumic charcaters
    if(!usersTodo.value.match(/^[a-z]+$/i)){
      document.getElementById("inputError").innerHTML = "You didn't enter a todo";
    }else{
      document.getElementById("inputError").innerHTML = "";
      let todo = createToDo(usersTodo.value);
      incompleteTodo.appendChild(todo);
      bindEvents(todo, todoComplete);
      //update localStorage
      getLi();
    }
  //empty the user input field once todo is submited
  usersTodo.value = "";
  libgStyle(incompleteTodo);
}

//li being sent to the completedTodos ul
function todoComplete(){
  let li = this.parentNode;
  completeTodo.appendChild(li);
  bindEvents(li, todoIncomplete);
  libgStyle(completeTodo);
  //diable editButton when li is sent to completedTodos ul
  li.querySelector("button.editButton").setAttribute("disabled", "");
  //add checkbox "checked" attribute
  li.querySelector("input").setAttribute("checked", "");
  //update localStorage
  getLi();
}

//completedTodos li being sent back to incompleteTodo ul
function todoIncomplete(){
  let li = this.parentNode;
  incompleteTodo.appendChild(li);
  bindEvents(li, todoComplete);
  libgStyle(incompleteTodo);
  //enable editButton when li is sent back to incompleteTodo ul
  li.querySelector("button.editButton").removeAttribute("disabled");
  //remove checkbox "checked" attribute
   li.querySelector("input").removeAttribute("checked");
   //update localStorage
  getLi();
}

function editTodo(){
  let li = this.parentNode;
  let editTodo = li.querySelector("input[type=text]");
  let label = li.querySelector("label");

  let hasClass = li.classList.contains("editing");

  if(hasClass) {
    label.innerText = editTodo.value;
  } else {
    editTodo.value = label.innerText;
  }
  li.classList.toggle("editing");
  //update localStorage
  getLi();
}

function deleteTodo(){
  let li = this.parentNode;
  let ul = li.parentNode;
  ul.removeChild(li);
  //update localStorage
  getLi();
}

//completely clear the todo list and localStorage
function clearList(){
  for(let i = 0; i < incompleteTodo.children.length;){
    incompleteTodo.removeChild(incompleteTodo.children[i]);
    console.log(i);
  }
  for(let i = 0; i < completeTodo.children.length;){
    completeTodo.removeChild(completeTodo.children[i]);
    console.log(i);
  }
  window.localStorage.clear();
}

//Bind events to the buttons when a new li is created
//checkboxInput is which ul the li will end up at when the checkbox is changed
function bindEvents(todoLi, checkboxInput){
  let checkBox = todoLi.querySelector("input[type=checkbox]");
  let editButton = todoLi.querySelector("button.editButton");
  let deleteButton = todoLi.querySelector("button.deleteButton");
  let editField = todoLi.querySelector("li.input[type=text]");

  deleteButton.onclick = deleteTodo;

  checkBox.onchange = checkboxInput;

  editButton.onclick = editTodo;

}


//loop through any already created li elements
for(let i = 0; i < incompleteTodo.children.length; i++){
  bindEvents(incompleteTodo.children[i], todoComplete);
}

for(let i = 0; i < completeTodo.children.length; i++){
  bindEvents(completeTodo.children[i], todoIncomplete);
}

//Event handler for clicking the add button
addButton.addEventListener("click", addTodo);

clearListButton.addEventListener("click", clearList);

//styling
//li background color generator
function libgStyle (list) { //pass in which list for styling
  for(let i = 0; i < list.children.length; i++){
    if(i % 2 === 0) {
      list.children[i].style.background = "#eddeed";
    } else {
      list.children[i].style.background = "	#ccf2ff";
    }
  }
}
// color any already created li elements
libgStyle(incompleteTodo);
libgStyle(completeTodo);
