"use strict";
/** This is a Demo for Typescript
 * This example used class based approach for rendering templated and maintaining stated
 * This has Drag and Drop Feature
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project Type
var projectStatus;
(function (projectStatus) {
    projectStatus[projectStatus["Active"] = 0] = "Active";
    projectStatus[projectStatus["Finished"] = 1] = "Finished";
})(projectStatus || (projectStatus = {}));
// This is to tell the type of the Project.
// Here we can also use interface but we are using class such that we can instantiate it
var Project = /** @class */ (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var State = /** @class */ (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    return State;
}());
var ProjectState = /** @class */ (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = [];
        return _this;
    }
    ProjectState.prototype.addProject = function (title, description, people) {
        var newProject = new Project(Math.random().toString(), title, description, people, projectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    };
    ProjectState.prototype.moveProject = function (projectId, newStatus) {
        var project = this.projects.find(function (project) { return project.id === projectId; });
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    };
    ProjectState.prototype.updateListeners = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFn = _a[_i];
            listenerFn(this.projects.slice());
        }
    };
    return ProjectState;
}(State));
var projectState = new ProjectState();
function AutoBind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjDescriptor;
}
// This class only to be inheroted not to be instantiated. so using abstract
var Component = /** @class */ (function () {
    function Component(templateId, hostElementId, inserAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(inserAtStart);
    }
    Component.prototype.attach = function (inserAtStart) {
        this.hostElement.insertAdjacentElement(inserAtStart ? "afterbegin" : "beforeend", this.element);
    };
    return Component;
}());
var ProjectItem = /** @class */ (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, "single-project", hostId, false, project.id) || this;
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "persons", {
        get: function () {
            if (this.project.people === 1) {
                return "1 Person";
            }
            else {
                return this.project.people + " Persons";
            }
        },
        enumerable: true,
        configurable: true
    });
    ProjectItem.prototype.configure = function () {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    };
    ProjectItem.prototype.renderContent = function () {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.persons + " assigned";
        this.element.querySelector("p").textContent = this.project.description;
    };
    ProjectItem.prototype.dragStartHandler = function (event) {
        event.dataTransfer.setData("text/plain", this.project.id);
        event.dataTransfer.effectAllowed = "move";
    };
    ProjectItem.prototype.dragEndHandler = function (event) {
        console.log("drag end");
    };
    __decorate([
        AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        AutoBind
    ], ProjectItem.prototype, "dragEndHandler", null);
    return ProjectItem;
}(Component));
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this = _super.call(this, "project-list", "app", false, type + "-projects") || this;
        _this.type = type;
        _this.assignedProjects = [];
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.configure = function () {
        var _this = this;
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        projectState.addListener(function (projects) {
            var relevantProjects = projects.filter(function (proj) {
                if (_this.type === "active") {
                    return proj.status === projectStatus.Active;
                }
                return proj.status === projectStatus.Finished;
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
    };
    ProjectList.prototype.renderProjects = function () {
        var listEl = document.getElementById(this.type + "-projects-list");
        listEl.innerHTML = "";
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var projItem = _a[_i];
            new ProjectItem(this.element.querySelector("ul").id, projItem);
        }
    };
    ProjectList.prototype.renderContent = function () {
        var listId = this.type + "-projects-list";
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    };
    ProjectList.prototype.dragOverHandler = function (event) {
        var _a;
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            // The drop event will not fore if preventDefault is not executed
            event.preventDefault();
            var listEl = this.element.querySelector("ul");
            (_a = listEl) === null || _a === void 0 ? void 0 : _a.classList.add("droppable");
        }
    };
    ProjectList.prototype.dropHandler = function (event) {
        var projectId = event.dataTransfer.getData("text/plain");
        projectState.moveProject(projectId, this.type === "active" ? projectStatus.Active : projectStatus.Finished);
    };
    ProjectList.prototype.dragLeaveHandler = function (event) {
        var _a;
        var listEl = this.element.querySelector("ul");
        (_a = listEl) === null || _a === void 0 ? void 0 : _a.classList.remove("droppable");
    };
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    return ProjectList;
}(Component));
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, "project-input", "app", true, "user-input") || this;
        _this.titleInputElement = _this.element.querySelector("#title");
        _this.descriptionInputElement = _this.element.querySelector("#description");
        _this.peopleInputElement = _this.element.querySelector("#people");
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.gatherUserInput = function () {
        var title = this.titleInputElement.value;
        var description = this.descriptionInputElement.value;
        var people = this.peopleInputElement.value;
        if (title.trim().length === 0 ||
            description.trim().length === 0 ||
            people.trim().length === 0) {
            alert("input is wrong");
            return;
        }
        else {
            return [title, description, +people];
        }
    };
    ProjectInput.prototype.handleSubmit = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], description = userInput[1], people = userInput[2];
            console.log("data is", title, description, +people);
            projectState.addProject(title, description, people);
        }
    };
    ProjectInput.prototype.renderContent = function () { };
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.handleSubmit);
    };
    __decorate([
        AutoBind
    ], ProjectInput.prototype, "handleSubmit", null);
    return ProjectInput;
}(Component));
var projectInput = new ProjectInput();
var projectListActive = new ProjectList("active");
var projectListFinished = new ProjectList("finished");
//# sourceMappingURL=index.js.map