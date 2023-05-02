// import Component from the react module
import React, {Component} from "react";
import Modal from "./Componentes/Modal";
import axios from 'axios';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title:"",
        descripcion: "",
        completed: false
      },
      taskList: []
    };
  }
  componentDidMount(){
    this.refreshList();
  }
  refreshList = () =>{
    axios
    .get("http://localhost:8000/api/tasks")
    .then(res => this.setState({ taskList: res.data }))
    .catch(err => console.log(err));
  };

  displayCompleted = status => {
    if(status){
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false});
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span onClick={() => this.displayCompleted(true)}
        className={this.state.viewCompleted ? "active" : ""}>
          completed
        </span>
        <span onClick={() => this.displayCompleted(false)}
        className={this.state.viewCompleted ? "" : "activate"}>
          Incompleted
        </span>
      </div>
    );
  };
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
      key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={'todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : "" }'} title={item.descripcion}>
          {item.title}
        </span>
        <span>
          <button onClick={() => this.editItem(item)}
          className="btn btn-secondary mr-2">
            Edit
          </button>
          <button onClick={() => this.handleDelete(item)}
          className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ));
  };


toggle = () => {
  this.setState({ modal: !this.state.modal });
};
handleSubmit = (item) => {
  this.toggle();
  alert("save" + JSON.stringify(item));
};

handleSubmit = (item) => {
  this.toggle();
  if (item.id) {
    axios
      .put('http://localhost:8000/api/tasks/${item.id}/', item)
      .then((res) =>this.refreshList());
    return;
  }
  axios
    .post("http://localhost:8000/api/tasks/", item)
    .then((res) => this.refreshList());
};

handleDelete = (item) => {
  axios
    .delete('http://localhost:8000/api/tasks/${item.id}')
    .then((res) =>this.refreshList());
};
handleDelete = (item) => {
  alert("delete" + JSON.stringify(item));
};

createItem = () => {
  const item = { title: "", descripcion: "", completed: false };
  this.setState({ activeItem:item, modal: !this.state.modal});
};

editItem = (item) => {
  this.setState({ activeItem: item, modal: !this.state.modal});
};

render() {
  return(
    <main className="content">
      <h1 className="col-md-6 col-sm-10 mx-auto p-0">
        Task Manager
      </h1>
      <div>
        <div className="card p-3">
          <div className="">
            <button onClick={this.createItem} className="btn btn-info">
              Add task
            </button>
          </div>
          {this.renderTabList()}
          <ul className="list-group list-group-flush">
            {this.renderItems()}
          </ul>
        </div>
      </div>
      {this.state.modal ? (
        <Modal
          activeItem={this.state.activeItem}
          toggle={this.toogle}
          onSave={this.handleSubmit}
        />
      ) : null }
    </main>
  );
}
}

export default App;
