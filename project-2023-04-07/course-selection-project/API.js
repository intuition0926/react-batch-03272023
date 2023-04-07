const API = (() => {
    const API_URL = "http://localhost:3000/courseList";

    const getCourseList = async () => {
        const res = await fetch(API_URL);
        return await res.json();
    }

    const postCourse = async (newCourse) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
            body: JSON.stringify(newCourse);
        })
        return await res.json();
    }

    const deleteCourse = async (id) => {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
    };

    return {
        getCourseList,
        postCourse,
        deleteCourse,
    };
})();