const projects = [];

const addProject = (project) => {
    projects.push(project);
};

const addTodo = (project, todo) => {
    project.todos.push(todo);
};

const getProject = (name) => {
    return projects.find(project => project.name === name);
};

const deleteTodo = (project, todo) => {
    const index = project.todos.indexOf(todo);

    if (index !== -1) {
        project.todos.splice(index, 1);
    }
};

const toggleTodo = (todo) => {
    todo.completed = !todo.completed;
};

const updateTodo = (todo, updatedDetails) => {
    Object.assign(todo, updatedDetails);
};

const deleteProject = (project) => {

    if (project.name === "Default") {
        return;
    }

    const index = projects.indexOf(project);

    if (index !== -1) {
        projects.splice(index, 1);
    }
};


export {
    projects,
    addProject,
    addTodo,
    getProject,
    deleteTodo,
    toggleTodo,
    updateTodo,
    deleteProject
};


