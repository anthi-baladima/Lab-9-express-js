// btnClear points to the #clear-button element in the DOM
const btnClear = document.querySelector('#clear-button');

//Adding and event listener: btnClear will react on the click event
//When the btnClear is clicked, then the callback fuction 
//(the 2nd argument of the event listener) will be called. 


const newItem= document.querySelector("#new-item");
const todoList=document.querySelector('#todo-list');

let timer = 0;
let delay = 200;
let prevent = false;

//Κανένα από αυτά δεν θα χρειαστεί redeclare ή update, άρα η const ταιριάζει

document.querySelectorAll('li').forEach(item => {
        //Θέτουμε timeOut στη διαδικασία που γίνεται με το ένα κλικ, για να μην εμποδίζεται η λειτουργία του διπλού κλικ
        //https://css-tricks.com/snippets/javascript/bind-different-events-to-click-and-double-click/?fbclid=IwAR2LUx48qauCBCrC4vKZcvP7a2xxDU1128WoKJKzLcCOUtkwpqp8IMPqdI4
        
        item.addEventListener("click", function() {
            timer = setTimeout(function() {
                if (!prevent) {
                    this.classList.toggle('completed');
                    fetch('http://localhost:3000/tasks/toggle/' + this.id);
                }
                prevent = false;
              }, delay);
        });
        item.addEventListener("dblclick", function() {
            clearTimeout(timer);
            prevent = true;
            todoList.removeChild(this);
            fetch('http://localhost:3000/tasks/remove/' + this.id);
        });
    }
);

newItem.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (newItem.value !== "") {
            const a = document.createElement('li');
            a.textContent = newItem.value;
            todoList.appendChild(a);
            fetch('http://localhost:3000/tasks/add/' + newItem.value).then(response => response.text()).then(data => {
                a.id = data;
            });

            //Ομοίως, θέτουμε timeOut στη διαδικασία που γίνεται με το ένα κλικ, για να μην εμποδίζεται η λειτουργία του διπλού κλικ
            //https://css-tricks.com/snippets/javascript/bind-different-events-to-click-and-double-click/?fbclid=IwAR2LUx48qauCBCrC4vKZcvP7a2xxDU1128WoKJKzLcCOUtkwpqp8IMPqdI4
        
            a.addEventListener("click", function() {
                timer = setTimeout(function() {
                    if (!prevent) {
                        a.classList.toggle('completed');
                        fetch('http://localhost:3000/tasks/toggle/' + a.id);
                    }
                    prevent = false;
                  }, delay);
            });
            a.addEventListener("dblclick", function() {
                clearTimeout(timer);
                prevent = true;
                todoList.removeChild(a);
                fetch('http://localhost:3000/tasks/remove/' + a.id);
            });
        }
    }
});

// btnClear.addEventListener("click", function() {
//     todoList.innerHTML='';
// });
