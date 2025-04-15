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

// Save all current data
function saveData() {
    const weightData = Array.from(document.querySelectorAll(".weightField")).map(field => ({
        name: field.children[0].value,
        grade: field.children[1].value,
        weight: field.children[2].value
    }));

    const pointData = Array.from(document.querySelectorAll(".pointField")).map(field => ({
        name: field.children[0].value,
        got: field.children[1].value,
        max: field.children[2].value
    }));

    localStorage.setItem("weightGradeData", JSON.stringify(weightData));
    localStorage.setItem("pointGradeData", JSON.stringify(pointData));
}

// Load saved data from localStorage
function loadData() {
    const weightData = JSON.parse(localStorage.getItem("weightGradeData") || "[]");
    const pointData = JSON.parse(localStorage.getItem("pointGradeData") || "[]");

    weightData.forEach(data => createWeight(data));
    pointData.forEach(data => createPoint(data));
}

// Function to Add New Point-Based Grade Input Fields
function createPoint(data = {}) {
    let tempDiv = document.createElement("div");
    tempDiv.classList.add("pointField");

    tempDiv.innerHTML = `
        <input type="text" placeholder="Assignment" value="${data.name || ''}">
        <input type="number" class="pointGot" placeholder="Points you got" value="${data.got || ''}">
        <input type="number" class="maxPoint" placeholder="Max points" value="${data.max || ''}">
        <button class="removeBtn">Remove</button>
    `;

    tempDiv.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", saveData);
    });

    tempDiv.querySelector(".removeBtn").addEventListener("click", () => {
        tempDiv.remove();
        saveData();
    });

    document.getElementById("pointContainer").appendChild(tempDiv);
    saveData(); // Save right after adding
}

// Function to Add New Weight-Based Grade Input Fields
function createWeight(data = {}) {
    let tempDiv = document.createElement("div");
    tempDiv.classList.add("weightField");

    tempDiv.innerHTML = `
        <input type="text" placeholder="Assignment" value="${data.name || ''}">
        <input type="number" class="gradeGot" placeholder="Grade you got" value="${data.grade || ''}">
        <input type="number" class="weight" placeholder="Weight (%)" value="${data.weight || ''}">
        <button class="removeBtn">Remove</button>
    `;

    tempDiv.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", saveData);
    });

    tempDiv.querySelector(".removeBtn").addEventListener("click", () => {
        tempDiv.remove();
        saveData();
    });

    document.getElementById("weightedContainer").appendChild(tempDiv);
    saveData(); // Save right after adding
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
    document.getElementById("weightGradeFinal").innerText = `Your final Weight-Based Grade is: ${finalGrade} %`;
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
document.getElementById("addWeight").addEventListener("click", () => createWeight());
document.getElementById("addPoint").addEventListener("click", () => createPoint());
document.getElementById("calcWeight").addEventListener("click", calculateWeightBasedGrade);
document.getElementById("calcPoint").addEventListener("click", calculatePointBasedGrade);

// Load saved inputs on page load
window.onload = loadData;
