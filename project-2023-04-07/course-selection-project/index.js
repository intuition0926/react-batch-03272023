class CourseModel {
    allCourses;
    selectedCourses;
    selectedFromCourses;
    constructor() {
        this.allCourses = [];
        this.selectedCourses = [];
        this.selectedFromCourses = [];
    }

    async fetchCourses() {
        const courses = await API.getCourseList();
        courses.forEach(course => {
            course.selected = false;
        })
        this.allCourses = courses;
        return courses;
    }

    getTotalCredit() {
        var credit = 0;
        this.allCourses.forEach(course => {
            if (this.selectedFromCourses.includes(course.courseId)) {
                credit += course.credit;
            }
        })
        return credit;
    }

    getSelectedCourses() {
        const courses = this.selectedCourses;
        this.allCourses.forEach(course => {
            if (this.selectedFromCourses.includes(course.courseId) && !courses.includes(course)) {
                courses.push(course); 
            }
        })
        this.selectedCourses = courses;
    }
}

class CourseView {
    selectedFromCourses;
    constructor() {
        this.allCourses = document.querySelector(".all-courses");
        this.selectedCourses = document.querySelector(".selected-Courses");
        this.selectButton = document.querySelector("button");
        this.p = document.getElementById("demo");
        this.totalCredit = document.querySelector(".totalCredit");
        this.selectedFromCourses = [];
    }

    displayAllCourses(courses) {
        courses.forEach((course, index) => {
            const courseElem = document.createElement("li");
            courseElem.classList.add(index);
            courseElem.classList.add(index % 2 == 1 ? "odd" : "even");
            courseElem.id = course.courseId;
            const courseName = document.createElement("div");
            courseName.innerText = course.courseName;
            const courseType = document.createElement("div");
            courseType.innerText = "Course Type : " + (course.required ? "Compulsory" : "Elective");
            const courseCredit = document.createElement("div");
            courseCredit.innerText = "Course Credit : " + course.credit;
            courseElem.appendChild(courseName);
            courseElem.appendChild(courseType);
            courseElem.appendChild(courseCredit);
            this.allCourses.appendChild(courseElem);
        })
    }

    displaySelectedCourses(courses) {
        var child = this.selectedCourses.lastElementChild; 
        while (child) {
            this.selectedCourses.removeChild(child);
            child = this.selectedCourses.lastElementChild;
        }
        courses.forEach((course, index) => {
            const courseElem = document.createElement("li");
            courseElem.classList.add(index);
            courseElem.classList.add(index % 2 == 1 ? "odd" : "even");
            courseElem.id = course.courseId;
            const courseName = document.createElement("div");
            courseName.innerText = course.courseName;
            const courseType = document.createElement("div");
            courseType.innerText = "Course Type : " + (course.required ? "Compulsory" : "Elective");
            const courseCredit = document.createElement("div");
            courseCredit.innerText = "Course Credit : " + course.credit;
            courseElem.appendChild(courseName);
            courseElem.appendChild(courseType);
            courseElem.appendChild(courseCredit);
            this.selectedCourses.appendChild(courseElem);
        })
    }
}

class CourseController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.model.fetchCourses().then(() => {
            const courses = this.model.allCourses;
            this.view.displayAllCourses(courses);
            this.handleSelection();
            this.handleSelectButton();
        })
    }

    handleSelection() {
        this.view.allCourses.addEventListener("click", (e) => {
            e.stopPropagation();
            const elem = e.target.parentElement;
            if (elem.tagName === "LI") {
                if (!elem.classList.contains("selected")) {
                    elem.classList.add("selected");
                    this.view.selectedFromCourses.push(parseInt(elem.id));
                    this.model.selectedFromCourses.push(parseInt(elem.id));
                    this.handleTotalCredit();
                } else {
                    elem.classList.remove("selected");
                    this.view.selectedFromCourses.pop(parseInt(elem.id));
                    this.model.selectedFromCourses.pop(parseInt(elem.id));
                    this.handleTotalCredit();
                }
            }
        })
        this.view.selectedCourses.addEventListener("click", (e) => {
            e.stopPropagation();
            const elem = e.target.parentElement;
            console.log(elem.tagName);
            if (elem.tagName === "LI") {
                if (!elem.classList.contains("selected")) {
                    elem.classList.add("selected");
                    this.view.selectedFromCourses.push(parseInt(elem.id));
                    this.model.selectedFromCourses.push(parseInt(elem.id));
                    this.handleTotalCredit();
                } else {
                    elem.classList.remove("selected");
                    this.view.selectedFromCourses.pop(parseInt(elem.id));
                    this.model.selectedFromCourses.pop(parseInt(elem.id));
                    this.handleTotalCredit();
                }
            }
        })
    }

    handleTotalCredit() {
        this.view.totalCredit.innerText = this.model.getTotalCredit();
    }

    handleSelectButton() {
        this.view.selectButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (parseInt(this.view.totalCredit.innerText) > 18) {
                alert("You can only choose up to 18 credits in one semester");
            } else {
                var txt = "You have chosen " + this.view.totalCredit.innerText + " credits for this semester. You cannot change once you submit. Do you want to confirm?";
                if (confirm(txt)) {
                    this.model.getSelectedCourses();
                    this.view.displaySelectedCourses(this.model.selectedCourses);
                    this.view.selectButton.setAttribute("disabled", true);
                }
            }
        })
    }
}

const controller = new CourseController(new CourseModel(), new CourseView());