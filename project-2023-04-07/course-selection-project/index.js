class CourseModel {
    allCourses;
    selectedCourses;
    constructor() {
        this.allCourses = [];
        this.selectedCourses = [];
    }

    async fetchCourses() {
        const courses = await API.getCourseList();
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
    constructor() {
        this.allCourse = document.querySelector(".all-courses");
        this.selectedCourse = document.querySelector(".selected-Courses");
    }

    createCourse(course) {
        const courseElem = document.createElement("li");
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
        this.allCourse.appendChild(courseElem);
    }

    displayAllCourses(courses) {
        courses.forEach(course => {
            this.createCourse(course);
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
        })
    }
}

const controller = new CourseController(new CourseModel(), new CourseView());