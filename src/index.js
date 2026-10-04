import "./style.css";

import createProject from "./project.js";

import {
    projects,
    addProject,
    deleteProject
} from "./projectManager.js";

import {
    renderProjects,
    renderTodos,
    renderAddTodo,
    renderAddProject
} from "./dom.js";

import {
    saveProjects,
    loadProjects
} from "./storage.js";


// --------------------------------
// LOAD EXISTING DATA
// --------------------------------

const savedProjects = loadProjects();


// --------------------------------
// FIRST TIME OPENING THE APP
// --------------------------------

if (!savedProjects || savedProjects.length === 0) {

    const defaultProject =
        createProject("Default");

    addProject(defaultProject);

    saveProjects(projects);

}


// --------------------------------
// LOAD SAVED PROJECTS
// --------------------------------

else {

    projects.push(...savedProjects);

}


// --------------------------------
// CURRENT PROJECT
// --------------------------------

let currentProject = projects[0];


// --------------------------------
// RENDER PROJECT LIST
// --------------------------------

const renderProjectList = () => {

    renderProjects(

        projects,

        // Select project
        (project) => {

            currentProject = project;

            renderTodos(project);

        },

        // Delete project
        (project) => {

            const confirmed = confirm(
                `Are you sure you want to delete "${project.name}"?`
            );

            if (!confirmed) {
                return;
            }

            deleteProject(project);


            if (currentProject === project) {

                currentProject = projects[0];

                renderTodos(currentProject);

            }


            saveProjects(projects);

            renderProjectList();

        }

    );

};


// --------------------------------
// INITIAL DISPLAY
// --------------------------------

renderProjectList();

renderTodos(currentProject);


// --------------------------------
// ADD TODO
// --------------------------------

const addTodoButton =
    document.querySelector("#add-todo");


addTodoButton.addEventListener(
    "click",
    () => {

        renderAddTodo(
            currentProject,
            () => {

                saveProjects(projects);

                renderTodos(currentProject);

            }
        );

    }
);


// --------------------------------
// ADD PROJECT
// --------------------------------

const addProjectButton =
    document.querySelector("#add-project");


addProjectButton.addEventListener(
    "click",
    () => {

        renderAddProject(
            (name) => {

                const newProject =
                    createProject(name);


                addProject(newProject);


                currentProject =
                    newProject;


                saveProjects(projects);


                renderProjectList();

                renderTodos(currentProject);

            }
        );

    }
);