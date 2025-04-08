// Toggle Between Weight-Based and Point-Based Calculator
let weight = document.getElementById("weight");
let point = document.getElementById("point");

let assignmentWeight = document.getElementById("weightGrade");
let assignmentPoint = document.getElementById("pointGrade");

weight.addEventListener("click", () => {
    assignmentPoint.classList.add("hide");
    assignmentWeight.classList.remove("hide");
});

point.addEventListener("click", () => {
    assignmentWeight.classList.add("hide");
    assignmentPoint.classList.remove("hide");
});

// Function to Add New Point-Based Grade Input Fields
function createPoint() {
    let tempDiv = document.createElement("div");
    tempDiv.classList.add("pointField");

    tempDiv.innerHTML = `
        <input type="text" placeholder="Assignment">
        <input type="number" class="pointGot" placeholder="Points you got">
        <input type="number" class="maxPoint" placeholder="Max points">
        <button class="removeBtn">Remove</button> <!-- Remove button -->
    `;

    // Now, we can safely attach the event listener to the remove button after it's added to the DOM
    tempDiv.querySelector(".removeBtn").addEventListener("click", () => {
        tempDiv.remove(); // Removes the div
    });

    document.getElementById("pointContainer").appendChild(tempDiv);
}

// Function to Add New Weight-Based Grade Input Fields
function createWeight() {
    let tempDiv = document.createElement("div");
    tempDiv.classList.add("weightField");

    tempDiv.innerHTML = `
        <input type="text" placeholder="Assignment">
        <input type="number" class="gradeGot" placeholder="Grade you got">
        <input type="number" class="weight" placeholder="Weight (%)">
        <button class="removeBtn">Remove</button> <!-- Remove button -->
    `;

    // Now, we can safely attach the event listener to the remove button after it's added to the DOM
    tempDiv.querySelector(".removeBtn").addEventListener("click", () => {
        tempDiv.remove(); // Removes the div
    });

    document.getElementById("weightedContainer").appendChild(tempDiv);
}

// Function to Calculate Weight-Based Grade
function calculateWeightBasedGrade() {
    let grades = document.querySelectorAll(".gradeGot");
    let weights = document.querySelectorAll(".weight");

    let totalWeightedScore = 0;
    let totalWeight = 0;

    grades.forEach((gradeInput, index) => {
        let grade = parseFloat(gradeInput.value);
        let weight = parseFloat(weights[index].value);

        if (!isNaN(grade) && !isNaN(weight) && weight > 0) {
            totalWeightedScore += grade * (weight / 100);
            totalWeight += weight;
        }
    });

    if (totalWeight === 0) {
        alert("Please enter valid numbers for weight and grades.");
        return;
    }

    let finalGrade = (totalWeightedScore / (totalWeight / 100)).toFixed(2);
    document.getElementById("weightGradeFinal").innerText = `Your final Point-Based Grade is: ${finalGrade} %`;

}

// Function to Calculate Point-Based Grade
function calculatePointBasedGrade() {
    let pointsGot = document.querySelectorAll(".pointGot");
    let maxPoints = document.querySelectorAll(".maxPoint");

    let totalPointsGot = 0;
    let totalMaxPoints = 0;

    pointsGot.forEach((pointInput, index) => {
        let got = parseFloat(pointInput.value);
        let max = parseFloat(maxPoints[index].value);

        if (!isNaN(got) && !isNaN(max) && max > 0) {
            totalPointsGot += got;
            totalMaxPoints += max;
        }
    });

    if (totalMaxPoints === 0) {
        alert("Please enter valid numbers for points.");
        return;
    }

    let finalGrade = ((totalPointsGot / totalMaxPoints) * 100).toFixed(2);
    
    
    document.getElementById("pointGradeFinal").innerText = `Your final Point-Based Grade is: ${finalGrade} %`;

}

// Attach Event Listeners
document.getElementById("addWeight").addEventListener("click", createWeight);
document.getElementById("addPoint").addEventListener("click", createPoint);
document.getElementById("calcWeight").addEventListener("click", calculateWeightBasedGrade);
document.getElementById("calcPoint").addEventListener("click", calculatePointBasedGrade);
