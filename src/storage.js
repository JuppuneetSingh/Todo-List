const saveProjects = (projects) => {
    localStorage.setItem("projects", JSON.stringify(projects));
};


const loadProjects = () => {
    const savedProjects = localStorage.getItem("projects");

    if (!savedProjects) {
        return null;
    }

    return JSON.parse(savedProjects);
};


export {
    saveProjects,
    loadProjects
};