document.addEventListener('DOMContentLoaded', function() {
    // Add Course Button Functionality
    document.getElementById("add-course").addEventListener("click", function() {
        const courseDiv = document.createElement("div");
        courseDiv.classList.add("course");
        
        courseDiv.innerHTML = `
            <input type="text" class="course-name" placeholder="Course Name">
            <select class="grade">
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="F">F</option>
            </select>
            <input type="number" class="credits" step="0.5" placeholder="Credits">
            <button class="remove-course">Remove</button>
        `;
        
        document.getElementById("courses").appendChild(courseDiv);
        
        // Add event listener to the new remove button
        courseDiv.querySelector(".remove-course").addEventListener("click", function() {
            courseDiv.remove();
        });
    });

    // Calculate GPA Button Functionality
    document.getElementById("calculate-gpa").addEventListener("click", function() {
        const courses = document.querySelectorAll(".course");
        let totalPoints = 0;
        let totalCredits = 0;
        
        // GPA Scale Map
        const gradeScale = {
            "A+": 4.0,
            "A": 4.0,
            "A-": 3.7,
            "B+": 3.3,
            "B": 3.0,
            "B-": 2.7,
            "C+": 2.3,
            "C": 2.0,
            "C-": 1.7,
            "D+": 1.3,
            "D": 1.0,
            "F": 0.0
        };
        
        courses.forEach(course => {
            const grade = course.querySelector(".grade").value;
            const credits = parseFloat(course.querySelector(".credits").value);
            
            if (gradeScale[grade] !== undefined && !isNaN(credits)) {
                totalPoints += gradeScale[grade] * credits;
                totalCredits += credits;
            }
        });
        
        // Include optional current GPA and credits
        const currentGPA = parseFloat(document.getElementById("current-gpa").value);
        const totalCreditsExisting = parseFloat(document.getElementById("total-credits").value);
        
        if (!isNaN(currentGPA) && !isNaN(totalCreditsExisting)) {
            totalPoints += currentGPA * totalCreditsExisting;
            totalCredits += totalCreditsExisting;
        }
        
        if (totalCredits > 0) {
            const gpa = totalPoints / totalCredits;
            document.getElementById("result").textContent = `Your GPA is: ${gpa.toFixed(2)}`;
        } else {
            document.getElementById("result").textContent = "Please enter valid courses and credits.";
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});