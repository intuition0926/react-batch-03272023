class CourseModel {
    allCourses;
    selectedCourses;
    constructor() {
        this.allCourses = [];
        this.selectedCourses = [];
    }

    async fetchCourses() {
        const courses = await API.getCourseList();
        courses.forEach(course => {
            course.selected = false;
        })
        this.allCourses = courses;
        return courses;
    }

    async addCourse(course) {
        this.selectedCourses.push(course);
        return course;
    }

    async deleteCourse(id) {
        await API.deleteCourse(id);
    }

    getSelectedCourse() {
        this.selectedCourses = this.allCourses.filter(course => course.selected);
        return this.selectedCourses;
    }
}

class CourseView {
    constructor() {
        this.allCourses = document.querySelector(".all-courses");
        this.selectedCourses = document.querySelector(".selected-Courses");
        this.selectButton = document.querySelector("button");
        this.p = document.getElementById("demo");
        this.totalCredit = document.querySelector(".totalCredit");
    }

    createCourse(course) {
        const courseElem = document.createElement("li");
        courseElem.setAttribute("selected", false);
        courseElem.id = course.id;
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
    }

    createSelectedCourse(course) {
        const courseElem = document.createElement("li");
        courseElem.setAttribute("selected", false);
        courseElem.id = course.id;
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
    }

    displayAllCourses(courses) {
        courses.forEach(course => {
            const courseElem = document.createElement("li");
            courseElem.style.backgroundColor = "white";
            courseElem.id = course.id;
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
        courses.forEach(course => {
            this.createSelectedCourse(course);
        })
    }

    handleSelection(courses) {
        courses.addEventListener("click", (e) => {
            e.stopPropagation();
            const elem = e.target.parentElement;
            console.log(elem.tagName);
            if (elem.tagName === "LI") {
                if (elem.style.backgroundColor === "white") {
                    elem.style.backgroundColor = "blue";
                } else {
                    elem.style.backgroundColor = "white";
                }
            }
        })
    }

    handleSelectButton() {
        this.selectButton.addEventListener("click", (e) => {
            e.preventDefault();
            var txt = "You have chosen " + this.totalCredit.innerText + " credits for this semester. You cannot change once you submit. Do you want to confirm?";
            if (confirm(txt)) {

            } else {
                
            }
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
            const selectedCourses = this.model.selectedCourses;
            this.view.displayAllCourses(courses);
            this.view.displaySelectedCourses(selectedCourses);
            this.view.handleSelectButton();
            this.view.handleSelection(this.view.allCourses);
            this.view.handleSelection(this.view.selectedCourses);
        })
    }

    
}

const controller = new CourseController(new CourseModel(), new CourseView());