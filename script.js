// Add Course Input Fields
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
    
    // Remove Course
    courseDiv.querySelector(".remove-course").addEventListener("click", function() {
        courseDiv.remove();
    });
});

// GPA Calculation for Current Courses
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

// GPA Planning (Calculate Required GPA)
// GPA Planning (Calculate Required GPA)
function calculatePlanningGPA() {
    // Get values from input fields
    const currentGPA = parseFloat(document.getElementById("currentGPA").value);
    const targetGPA = parseFloat(document.getElementById("targetGPA").value);
    const currentCredits = parseFloat(document.getElementById("currentCredits").value);
    const additionalCredits = parseFloat(document.getElementById("additionalCredits").value);
    
    // Check if all inputs are valid numbers
    if (isNaN(currentGPA) || isNaN(targetGPA) || isNaN(currentCredits) || isNaN(additionalCredits)) {
        document.getElementById("planResult").textContent = "Please enter valid values for current GPA, target GPA, credits, and additional credits.";
        return;
    }
    
    // Calculate the total credits and required points
    const totalCredits = currentCredits + additionalCredits;
    const totalPointsRequired = targetGPA * totalCredits;
    const currentPoints = currentGPA * currentCredits;
    const requiredPoints = totalPointsRequired - currentPoints;

    // If required points is positive, calculate the required GPA for additional credits
    if (requiredPoints > 0) {
        const requiredGrade = requiredPoints / additionalCredits;
        
        // If the required GPA is above 4.0, it is impossible to achieve
        if (requiredGrade > 4.0) {
            document.getElementById("gpaResult").textContent = "It's not possible to reach your target GPA. You need more than a 4.0 GPA in your additional courses.";
        } else {
            document.getElementById("gpaResult").textContent = `You need a GPA of at least ${requiredGrade.toFixed(2)} in your additional courses.`;
        }
    } else {
        document.getElementById("gpaResult").textContent = "Your current GPA is already enough to reach your target GPA!";
    }
}


// Function to update the clock
function updateClock() {
    const clockElement = document.getElementById("clock");
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    clockElement.textContent = timeString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Call the function once to display the clock immediately when the page loads
updateClock();

// GPA Planning Event Handlers
document.getElementById("planCalculate").addEventListener("click", calculatePlanningGPA);
document.getElementById("planClear").addEventListener("click", function() {
    document.getElementById("currentGPA").value = "";
    document.getElementById("targetGPA").value = "";
    document.getElementById("currentCredits").value = "";
    document.getElementById("additionalCredits").value = "";
    document.getElementById("planResult").textContent = "";
});
