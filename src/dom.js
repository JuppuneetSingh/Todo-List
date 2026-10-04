import createTodo from "./todo.js";

import {
    projects,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo
} from "./projectManager.js";

import { saveProjects } from "./storage.js";


// --------------------------------
// RENDER PROJECTS
// --------------------------------

const renderProjects = (projects, onProjectClick, onProjectDelete) => {

    const projectList = document.querySelector("#project-list");

    projectList.innerHTML = "";

    projects.forEach((project) => {

        const projectContainer = document.createElement("div");

        const projectElement = document.createElement("button");

        projectElement.textContent = project.name;


        // Select project
        projectElement.addEventListener("click", () => {

            onProjectClick(project);

        });


        // Delete project
        if (project.name !== "Default") {

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", (event) => {

                event.stopPropagation();

                onProjectDelete(project);

            });

            projectContainer.append(
                projectElement,
                deleteButton
            );

        }

        else {

            projectContainer.appendChild(projectElement);

        }


        projectList.appendChild(projectContainer);

    });

};


// --------------------------------
// RENDER TODOS
// --------------------------------

const renderTodos = (project) => {

    const todoList = document.querySelector("#todo-list");

    const projectTitle =
        document.querySelector("#project-title");

    projectTitle.textContent = project.name;

    todoList.innerHTML = "";


    // -------------------------
    // EMPTY PROJECT
    // -------------------------

    if (project.todos.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No todos yet. Add your first todo.";

        emptyMessage.classList.add(
            "empty-message"
        );

        todoList.appendChild(
            emptyMessage
        );

        return;
    }


    project.todos.forEach((todo) => {

        const todoElement =
            document.createElement("div");

        todoElement.classList.add("todo-card");


        // -------------------------
        // CHECKBOX
        // -------------------------

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked =
            todo.completed;

        checkbox.classList.add(
            "todo-checkbox"
        );


        checkbox.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleTodo(todo);

                saveProjects(projects);

                renderTodos(project);

            }
        );


        // -------------------------
        // TODO CONTENT
        // -------------------------

        const content =
            document.createElement("div");

        content.classList.add(
            "todo-content"
        );


        // Title
        const title =
            document.createElement("h3");

        title.textContent =
            todo.title;


        // Description
        const description =
            document.createElement("p");

        description.textContent =
            todo.description;


        // Bottom information
        const meta =
            document.createElement("div");

        meta.classList.add(
            "todo-meta"
        );


        // Due date
        const dueDate =
            document.createElement("span");

        dueDate.textContent =
            `Due: ${todo.dueDate}`;


        // Priority
        const priority =
            document.createElement("span");

        priority.textContent =
            todo.priority.toUpperCase();

        priority.classList.add(
            `priority-${todo.priority}`
        );


        meta.append(
            dueDate
        );


        content.append(
            title,
            description,
            meta
        );


        // -------------------------
        // COMPLETED STYLE
        // -------------------------

        if (todo.completed) {

            todoElement.classList.add(
                "completed"
            );

        }


        // -------------------------
        // CLICK TODO → EDIT
        // -------------------------

        todoElement.addEventListener(
            "click",
            () => {

                renderTodoDetails(
                    project,
                    todo
                );

            }
        );


        // -------------------------
        // BUILD CARD
        // -------------------------

        todoElement.append(
            checkbox,
            content,
            priority
        );


        todoList.appendChild(
            todoElement
        );

    });

};

// --------------------------------
// TODO DETAILS
// --------------------------------

const renderTodoDetails = (project, todo) => {

    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");


    const modal = document.createElement("div");
    modal.classList.add("modal");


    // Heading
    const heading = document.createElement("h2");
    heading.textContent = "Edit Todo";


    // -------------------------
    // TITLE
    // -------------------------

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";

    const titleInput = document.createElement("input");

    titleInput.type = "text";
    titleInput.value = todo.title;


    // -------------------------
    // DESCRIPTION
    // -------------------------

    const descriptionLabel = document.createElement("label");

    descriptionLabel.textContent = "Description";


    const descriptionInput =
        document.createElement("textarea");

    descriptionInput.value = todo.description;


    // -------------------------
    // DUE DATE
    // -------------------------

    const dueDateLabel =
        document.createElement("label");

    dueDateLabel.textContent = "Due Date";


    const dueDateInput =
        document.createElement("input");

    dueDateInput.type = "date";

    dueDateInput.value = todo.dueDate;


    // -------------------------
    // PRIORITY
    // -------------------------

    const priorityLabel =
        document.createElement("label");

    priorityLabel.textContent = "Priority";


    const priorityInput =
        document.createElement("select");


    ["low", "medium", "high"].forEach(
        (priority) => {

            const option =
                document.createElement("option");

            option.value = priority;

            option.textContent =
                priority.charAt(0).toUpperCase()
                + priority.slice(1);


            if (priority === todo.priority) {
                option.selected = true;
            }


            priorityInput.appendChild(option);

        }
    );


    // -------------------------
    // NOTES
    // -------------------------

    const notesLabel =
        document.createElement("label");

    notesLabel.textContent = "Notes";


    const notesInput =
        document.createElement("textarea");

    notesInput.value = todo.notes;


    // -------------------------
    // BUTTONS
    // -------------------------

    const buttons =
        document.createElement("div");

    buttons.classList.add("modal-buttons");


    const cancelButton =
        document.createElement("button");

    cancelButton.textContent = "Cancel";

    cancelButton.classList.add(
        "cancel-button"
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add(
        "delete-button"
    );


    const saveButton =
        document.createElement("button");

    saveButton.textContent = "Save";

    saveButton.classList.add(
        "confirm-button"
    );


    // -------------------------
    // SAVE
    // -------------------------

    saveButton.addEventListener(
        "click",
        () => {

            const title =
                titleInput.value.trim();


            if (!title) {

                titleInput.focus();

                return;

            }


            updateTodo(todo, {

                title,

                description:
                    descriptionInput.value.trim(),

                dueDate:
                    dueDateInput.value,

                priority:
                    priorityInput.value,

                notes:
                    notesInput.value.trim()

            });


            saveProjects(projects);

            overlay.remove();

            renderTodos(project);

        }
    );


    // -------------------------
    // DELETE
    // -------------------------

   deleteButton.addEventListener(
    "click",
    () => {

        const confirmed = confirm(
            "Are you sure you want to delete this todo?"
        );

        if (!confirmed) {
            return;
        }

        deleteTodo(project, todo);

        saveProjects(projects);

        overlay.remove();

        renderTodos(project);

    }
);


    // -------------------------
    // CANCEL
    // -------------------------

    cancelButton.addEventListener(
        "click",
        () => {

            overlay.remove();

        }
    );


    // -------------------------
    // BUILD MODAL
    // -------------------------

    buttons.append(
        cancelButton,
        deleteButton,
        saveButton
    );


    modal.append(

        heading,

        titleLabel,
        titleInput,

        descriptionLabel,
        descriptionInput,

        dueDateLabel,
        dueDateInput,

        priorityLabel,
        priorityInput,

        notesLabel,
        notesInput,

        buttons

    );


    overlay.appendChild(modal);

    document.body.appendChild(overlay);


    titleInput.focus();

};


// --------------------------------
// ADD TODO
// --------------------------------

const renderAddTodo = (project, onTodoCreated) => {

    // Overlay
    const overlay = document.createElement("div");

    overlay.classList.add("modal-overlay");


    // Modal
    const modal = document.createElement("div");

    modal.classList.add("modal");


    // Heading
    const heading = document.createElement("h2");

    heading.textContent = "Add Todo";


    // -------------------------
    // TITLE
    // -------------------------

    const titleLabel = document.createElement("label");

    titleLabel.textContent = "Title";


    const titleInput = document.createElement("input");

    titleInput.type = "text";

    titleInput.placeholder = "Todo title";


    // -------------------------
    // DESCRIPTION
    // -------------------------

    const descriptionLabel =
        document.createElement("label");

    descriptionLabel.textContent =
        "Description";


    const descriptionInput =
        document.createElement("textarea");

    descriptionInput.placeholder =
        "Describe your task...";


    // -------------------------
    // DUE DATE
    // -------------------------

    const dueDateLabel =
        document.createElement("label");

    dueDateLabel.textContent =
        "Due Date";


    const dueDateInput =
        document.createElement("input");

    dueDateInput.type = "date";


    // -------------------------
    // PRIORITY
    // -------------------------

    const priorityLabel =
        document.createElement("label");

    priorityLabel.textContent =
        "Priority";


    const priorityInput =
        document.createElement("select");


    const priorities = [
        "low",
        "medium",
        "high"
    ];


    priorities.forEach((priority) => {

        const option =
            document.createElement("option");

        option.value = priority;

        option.textContent =
            priority.charAt(0).toUpperCase()
            + priority.slice(1);

        priorityInput.appendChild(option);

    });


    // -------------------------
    // NOTES
    // -------------------------

    const notesLabel =
        document.createElement("label");

    notesLabel.textContent = "Notes";


    const notesInput =
        document.createElement("textarea");

    notesInput.placeholder =
        "Additional notes...";


    // -------------------------
    // BUTTONS
    // -------------------------

    const buttons =
        document.createElement("div");

    buttons.classList.add("modal-buttons");


    const cancelButton =
        document.createElement("button");

    cancelButton.textContent =
        "Cancel";

    cancelButton.classList.add(
        "cancel-button"
    );


    const confirmButton =
        document.createElement("button");

    confirmButton.textContent =
        "Confirm";

    confirmButton.classList.add(
        "confirm-button"
    );


    // -------------------------
    // CONFIRM
    // -------------------------

    confirmButton.addEventListener(
        "click",
        () => {

            const title =
                titleInput.value.trim();


            if (!title) {

                titleInput.focus();

                return;

            }


            const todo = createTodo(

                title,

                descriptionInput.value.trim(),

                dueDateInput.value,

                priorityInput.value,

                notesInput.value.trim()

            );


            addTodo(project, todo);


            onTodoCreated();


            overlay.remove();

        }
    );


    // -------------------------
    // CANCEL
    // -------------------------

    cancelButton.addEventListener(
        "click",
        () => {

            overlay.remove();

        }
    );


    // -------------------------
    // BUILD MODAL
    // -------------------------

    buttons.append(
        cancelButton,
        confirmButton
    );


    modal.append(

        heading,

        titleLabel,
        titleInput,

        descriptionLabel,
        descriptionInput,

        dueDateLabel,
        dueDateInput,

        priorityLabel,
        priorityInput,

        notesLabel,
        notesInput,

        buttons

    );


    overlay.appendChild(modal);

    document.body.appendChild(overlay);


    titleInput.focus();

};

// --------------------------------
// ADD PROJECT
// --------------------------------

const renderAddProject = (onProjectCreated) => {

    // Overlay
    const overlay = document.createElement("div");

    overlay.classList.add("modal-overlay");


    // Modal
    const modal = document.createElement("div");

    modal.classList.add("modal");


    // Heading
    const heading = document.createElement("h2");

    heading.textContent = "Add Project";


    // Label
    const label = document.createElement("label");

    label.textContent = "Name";


    // Input
    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = "Project name";


    // Buttons container
    const buttons = document.createElement("div");

    buttons.classList.add("modal-buttons");


    // Cancel
    const cancelButton = document.createElement("button");

    cancelButton.textContent = "Cancel";

    cancelButton.classList.add("cancel-button");


    // Confirm
    const confirmButton = document.createElement("button");

    confirmButton.textContent = "Confirm";

    confirmButton.classList.add("confirm-button");


    // Confirm functionality
    confirmButton.addEventListener("click", () => {

        const name = input.value.trim();

        if (!name) {
            input.focus();
            return;
        }

        onProjectCreated(name);

        overlay.remove();

    });


    // Cancel functionality
    cancelButton.addEventListener("click", () => {

        overlay.remove();

    });


    buttons.append(
        cancelButton,
        confirmButton
    );


    modal.append(
        heading,
        label,
        input,
        buttons
    );


    overlay.appendChild(modal);

    document.body.appendChild(overlay);


    input.focus();

};


// --------------------------------
// EXPORTS
// --------------------------------

export {

    renderProjects,

    renderTodos,

    renderTodoDetails,

    renderAddTodo,

    renderAddProject

};

