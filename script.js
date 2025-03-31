const classes = document.getElementById('course');
const answer = document.getElementById('answer');

function addCourse() {
    const course = document.createElement('div');
    course.classList.add('course_entry');

    course.innerHTML = `
        <input type="text" class="courses" placeholder="Course Name">
        <input type="number" class="credit"  placeholder="Credit">
        <select class="grade">
            <option>A</option>
            <option>A-</option>
            <option>B+</option>
            <option>B</option>
            <option>B-</option>
            <option>C+</option>
            <option>C</option>
            <option>C-</option>
            <option>D+</option>
            <option>D</option>
            <option>D-</option>
            <option>E</option>
        </select>
        <button class="remove-btn">Remove</button>
    `;

    // Remove button functionality
    course.querySelector('.remove-btn').addEventListener('click', function () {
        course.remove();
    });

    classes.appendChild(course);
}

const gpaGrade = {
    "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0,
    "D-": 0.7, "E": 0.0
};

function GPACalculation() {
    let totalCredits = 0;
    let totalPoints = 0;

    document.querySelectorAll('.course_entry').forEach(course => {
        const grade = course.querySelector('.grade').value;
        const credit = parseFloat(course.querySelector('.credit').value);

        if (!isNaN(credit) && credit > 0 && gpaGrade.hasOwnProperty(grade)) {
            totalCredits += credit;
            totalPoints += gpaGrade[grade] * credit;
        }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
}

function sumitFinal() {
    const gpaDiv = document.createElement('div');
    const gpaFinal = GPACalculation();

    gpaDiv.textContent = `GPA is ${gpaFinal}`;
    

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '10px';
    removeBtn.addEventListener('click', function () {
        gpaDiv.remove();
    });

    gpaDiv.appendChild(removeBtn);
    answer.append(gpaDiv);
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById("clock").textContent = timeString;

}

setInterval(updateClock, 100); // Update every second
updateClock(); // Initial call to avoid delay
