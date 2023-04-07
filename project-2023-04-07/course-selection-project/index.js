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

    createSelectedCourse(course) {
        const courseElem = document.createElement("li");
        courseElem.style.backgroundColor = "white";
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
    }

    displayAllCourses(courses) {
        courses.forEach(course => {
            const courseElem = document.createElement("li");
            courseElem.style.backgroundColor = "white";
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
        courses.forEach(course => {
            console.log(JSON.stringify(course));
            this.createSelectedCourse(course);
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
                if (elem.style.backgroundColor === "white") {
                    elem.style.backgroundColor = "blue";
                    this.view.selectedFromCourses.push(parseInt(elem.id));
                    this.handleTotalCredit();
                } else {
                    elem.style.backgroundColor = "white";
                    this.view.selectedFromCourses.pop(parseInt(elem.id));
                    this.handleTotalCredit();
                }
            }
        })
        this.view.selectedCourses.addEventListener("click", (e) => {
            e.stopPropagation();
            const elem = e.target.parentElement;
            console.log(elem.tagName);
            if (elem.tagName === "LI") {
                if (elem.style.backgroundColor === "white") {
                    elem.style.backgroundColor = "blue";
                    this.view.selectedFromCourses.pop(parseInt(elem.id));
                    this.handleTotalCredit();
                } else {
                    elem.style.backgroundColor = "white";
                    this.view.selectedFromCourses.push(parseInt(elem.id));
                    this.handleTotalCredit();
                }
            }
        })
    }

    handleTotalCredit() {
        var credit = 0;
        this.model.allCourses.forEach(course => {
            if (this.view.selectedFromCourses.includes(course.courseId)) {
                credit += course.credit;
            }
        })
        this.view.totalCredit.innerText = credit;
    }

    handleSelectButton() {
        this.view.selectButton.addEventListener("click", (e) => {
            e.preventDefault();
            var txt = "You have chosen " + this.view.totalCredit.innerText + " credits for this semester. You cannot change once you submit. Do you want to confirm?";
            if (confirm(txt)) {
                const courses = [];
                this.model.allCourses.forEach(course => {
                    if (this.view.selectedFromCourses.includes(course.courseId)) {
                        courses.push(course);
                    }
                })
                this.model.selectedCourses = courses;
                this.view.displaySelectedCourses(this.model.selectedCourses);
            }
        })
    }
}

const controller = new CourseController(new CourseModel(), new CourseView());