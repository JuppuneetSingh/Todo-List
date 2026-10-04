const createTodo = (title,description,dueDate,priority,notes)=>{
    return {
        title,
        description,
        dueDate,
        priority,
        completed:false,
        notes
    };
};

export default createTodo;


