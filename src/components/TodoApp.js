import React, { useState, useEffect, useRef } from "react";
import "./todoapp.css";
import firebase from "firebase";
import db from "../firebase";

  function useDidMount() {
    const didMountRef = useRef(true);
    
    useEffect(() => {
      didMountRef.current = false;
    }, []);
    return didMountRef.current;
  };

  const dbRef = db.collection('todos').doc('list');

function TodoApp() {
  const didMount=useDidMount()
  const [task, setTask] = useState("");
  const [tasklist, setTaskList] = useState([]);


useEffect(() => {
    async function fetchData(){
      let temp = []
      const data=await dbRef.get();
      //if the array with the list of tasks is empty,
      // the tasklist array will be empty
      // and we will not have an error trying
      //to map through an empty array.
      if(data.data().todos.length > 0){
      data.data().todos.map(item=>
          temp.push(JSON.parse(item) )
      )}
    setTaskList(temp)
    }

    if(didMount){
      fetchData()
    }
},[didMount])

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  async function AddTask () {
    if (task !== "") {
      // every time we add a new task, the previous tasks
      // are added to the database as strings

      // const taskListToString =[]
      // tasklist.forEach((element)=>
      //   taskListToString.push(JSON.stringify(element))
      // );

      const itemToaddId= "\"id\"" + ":\"" + Math.floor(Math.random() * 1000) +"\""
      const itemToAddValue= "\"value\"" + ":\"" + task +"\""
      const itemToAddCompleted = "\"isCompleted\"" + ":false"
      const itemToAdd= "{"+itemToaddId+","+itemToAddValue+","+itemToAddCompleted+"}"

      // const newTask = {todos: [...taskListToString, itemToAdd]}
      // await dbRef.set(newTask)

      dbRef.update({   
              todos: firebase.firestore.FieldValue.arrayUnion(itemToAdd)
      })

      // updating the tasks lists locally. We're not fetching
      // the db list again to update the app.

      setTaskList([...tasklist, JSON.parse(itemToAdd)])
    }
  };


  async function deletetask (e, id) {
    e.preventDefault();
    setTaskList(tasklist.filter((t) => t.id != id));

    // send the new tasklist without the deleted task to the db

    // const taskListToString =[]
    // const filteredTaskList = tasklist.filter((t) => t.id != id)
    // filteredTaskList.forEach((element)=>
    //   taskListToString.push(JSON.stringify(element))
    // );

    // const newTaskList = {todos: [...taskListToString]}
    // await dbRef.set(newTaskList)

    const taskEvent = tasklist.filter((t) => t.id === id)
    console.log(taskEvent)

    dbRef.update({   
        todos: firebase.firestore.FieldValue.arrayRemove(JSON.stringify(taskEvent[0]))
    })
    
  };

  async function taskCompleted  (e, id) {
    e.preventDefault();
    //let's find index of element
    const element = tasklist.findIndex((elem) => elem.id == id);

    //copy array into new variable
    const newTaskList = [...tasklist];

    //edit our element
    newTaskList[element] = {
      ...newTaskList[element],
      isCompleted: true,
    };
    
    setTaskList(newTaskList);

    // the above code changed the todo list locally
    // after the change is made, the new lists with
    // the completed tasks is sent to the db asynchronously
    // with the set method
      
    const taskListToString =[]
    newTaskList.forEach((element)=>
      taskListToString.push(JSON.stringify(element))
    );

    const newTask = {todos: [...taskListToString]}
    await dbRef.set(newTask)


  };


  return (
    <div className="todo">
      <input
        type="text"
        name="text"
        id="text"
        onChange={(e) => handleChange(e)}
        placeholder="Add task here..."
      />
      <button className="add-btn" onClick={AddTask}>
        Add
      </button>
      <br />
      {tasklist !== [] ? (
        <ul>
          {tasklist.map((t) => (
            <li className={t.isCompleted ? "crossText" : "listitem"}>
              {t.value}
              <button
                className="completed"
                onClick={(e) => taskCompleted(e, t.id)}
              >
                Completed
              </button>

              <button className="delete" onClick={(e) => deletetask(e, t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default TodoApp;
