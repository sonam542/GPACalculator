// Global variables
let currentClassId = null;
let currentGradeType = 'weight'; // 'weight' or 'point'

// DOM Elements
const classSelection = document.getElementById("classSelection");
const calculatorView = document.getElementById("calculatorView");
const historyView = document.getElementById("historyView");
const classList = document.getElementById("classList");
const currentClassHeading = document.getElementById("currentClassHeading");
const newClassForm = document.getElementById("newClassForm");
const classNameInput = document.getElementById("classNameInput");
const backToClasses = document.getElementById("backToClasses");
const backFromHistory = document.getElementById("backFromHistory");
const homeLink = document.getElementById("homeLink");
const historyLink = document.getElementById("historyLink");
const classesLink = document.getElementById("classesLink");

// Initialize the app
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Show class selection by default
    showClassSelection();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        showClassSelection();
    });

    historyLink.addEventListener("click", (e) => {
        e.preventDefault();
        showHistory();
    });

    classesLink.addEventListener("click", (e) => {
        e.preventDefault();
        showClassSelection();
    });

    backToClasses.addEventListener("click", showClassSelection);
    backFromHistory.addEventListener("click", showClassSelection);

    // Class management
    document.getElementById("newClassBtn").addEventListener("click", () => {
        newClassForm.classList.remove("hide");
    });

    document.getElementById("saveClassBtn").addEventListener("click", createNewClass);
    document.getElementById("cancelClassBtn").addEventListener("click", () => {
        newClassForm.classList.add("hide");
        classNameInput.value = "";
    });

    // Grade type switching
    document.getElementById("weight").addEventListener("click", () => {
        document.getElementById("pointGrade").classList.add("hide");
        document.getElementById("weightGrade").classList.remove("hide");
        currentGradeType = 'weight';
    });

    document.getElementById("point").addEventListener("click", () => {
        document.getElementById("weightGrade").classList.add("hide");
        document.getElementById("pointGrade").classList.remove("hide");
        currentGradeType = 'point';
    });

    // Adding new fields
    document.getElementById("addWeight").addEventListener("click", () => {
        createWeight();
        saveCurrentClassData();
    });

    document.getElementById("addPoint").addEventListener("click", () => {
        createPoint();
        saveCurrentClassData();
    });

    // Calculations
    document.getElementById("calcWeight").addEventListener("click", () => {
        const grade = calculateWeightBasedGrade();
        if (grade !== null) {
            document.getElementById("weightGradeFinal").textContent = `Your final Weight-Based Grade is: ${grade}%`;
        }
    });

    document.getElementById("calcPoint").addEventListener("click", () => {
        const grade = calculatePointBasedGrade();
        if (grade !== null) {
            document.getElementById("pointGradeFinal").textContent = `Your final Point-Based Grade is: ${grade}%`;
        }
    });

    // Saving calculations
    document.getElementById("saveWeightCalc").addEventListener("click", () => {
        const grade = calculateWeightBasedGrade();
        if (grade !== null) {
            const classData = getClassData(currentClassId);
            if (classData) {
                saveCalculation('weight', grade, classData.name);
                alert("Calculation saved to history!");
            }
        }
    });

    document.getElementById("savePointCalc").addEventListener("click", () => {
        const grade = calculatePointBasedGrade();
        if (grade !== null) {
            const classData = getClassData(currentClassId);
            if (classData) {
                saveCalculation('point', grade, classData.name);
                alert("Calculation saved to history!");
            }
        }
    });
}

// Navigation functions
function showClassSelection() {
    classSelection.classList.remove("hide");
    calculatorView.classList.add("hide");
    historyView.classList.add("hide");
    loadClasses();
}

function showCalculator(classId) {
    currentClassId = classId;
    const classes = getClasses();
    const currentClass = classes.find(c => c.id === classId);
    
    if (!currentClass) {
        showClassSelection();
        return;
    }
    
    currentClassHeading.textContent = currentClass.name;
    classSelection.classList.add("hide");
    calculatorView.classList.remove("hide");
    historyView.classList.add("hide");
    
    // Load the class data
    loadClassData(classId);
}

function showHistory() {
    classSelection.classList.add("hide");
    calculatorView.classList.add("hide");
    historyView.classList.remove("hide");
    loadHistory();
}

// Class management
function getClasses() {
    const classes = localStorage.getItem("gradeCalculatorClasses");
    return classes ? JSON.parse(classes) : [];
}

function saveClasses(classes) {
    localStorage.setItem("gradeCalculatorClasses", JSON.stringify(classes));
}

function loadClasses() {
    const classes = getClasses();
    classList.innerHTML = "";
    
    if (classes.length === 0) {
        classList.innerHTML = "<p>No classes found. Create your first class!</p>";
        return;
    }
    
    classes.forEach(cls => {
        const classCard = document.createElement("div");
        classCard.className = "classCard";
        classCard.textContent = cls.name;
        classCard.addEventListener("click", () => showCalculator(cls.id));
        classList.appendChild(classCard);
    });
}

function createNewClass() {
    const className = classNameInput.value.trim();
    if (!className) {
        alert("Please enter a class name");
        return;
    }
    
    const classes = getClasses();
    const newClass = {
        id: Date.now().toString(),
        name: className,
        weightData: [],
        pointData: []
    };
    
    classes.push(newClass);
    saveClasses(classes);
    classNameInput.value = "";
    newClassForm.classList.add("hide");
    loadClasses();
}

// Class data management
function getClassData(classId) {
    const classes = getClasses();
    return classes.find(c => c.id === classId);
}

function saveClassData(classData) {
    const classes = getClasses();
    const index = classes.findIndex(c => c.id === classData.id);
    if (index !== -1) {
        classes[index] = classData;
        saveClasses(classes);
    }
}

function loadClassData(classId) {
    const classData = getClassData(classId);
    if (!classData) return;
    
    // Clear current inputs
    document.getElementById("weightedContainer").innerHTML = "";
    document.getElementById("pointContainer").innerHTML = "";
    
    // Load weight data
    classData.weightData.forEach(data => createWeight(data));
    
    // Load point data
    classData.pointData.forEach(data => createPoint(data));
}

// Grade calculation functions
function calculateWeightBasedGrade() {
    const gradeInputs = document.querySelectorAll(".gradeGot");
    const weightInputs = document.querySelectorAll(".weight");

    if (gradeInputs.length !== weightInputs.length) {
        alert("Mismatch between grade and weight inputs");
        return null;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;

    gradeInputs.forEach((gradeInput, index) => {
        const grade = parseFloat(gradeInput.value);
        const weight = parseFloat(weightInputs[index].value);

        if (!isNaN(grade) && !isNaN(weight) && weight > 0) {
            totalWeightedScore += grade * (weight / 100);
            totalWeight += weight;
        }
    });

    if (totalWeight === 0) {
        alert("Please enter valid numbers for weight and grades.");
        return null;
    }

    return (totalWeightedScore / (totalWeight / 100)).toFixed(2);
}

function calculatePointBasedGrade() {
    const pointsGotInputs = document.querySelectorAll(".pointGot");
    const maxPointsInputs = document.querySelectorAll(".maxPoint");

    if (pointsGotInputs.length !== maxPointsInputs.length) {
        alert("Mismatch between points got and max points inputs");
        return null;
    }

    let totalPointsGot = 0;
    let totalMaxPoints = 0;

    pointsGotInputs.forEach((pointInput, index) => {
        const got = parseFloat(pointInput.value);
        const max = parseFloat(maxPointsInputs[index].value);

        if (!isNaN(got) && !isNaN(max) && max > 0) {
            totalPointsGot += got;
            totalMaxPoints += max;
        }
    });

    if (totalMaxPoints === 0) {
        alert("Please enter valid numbers for points.");
        return null;
    }

    return ((totalPointsGot / totalMaxPoints) * 100).toFixed(2);
}

// Input field creation
function createWeight(data = {}) {
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("weightField");

    tempDiv.innerHTML = `
        <input type="text" placeholder="Assignment" value="${data.name || ''}">
        <input type="number" class="gradeGot" placeholder="Grade you got" value="${data.grade || ''}" step="0.01">
        <input type="number" class="weight" placeholder="Weight (%)" value="${data.weight || ''}" step="0.01">
        <button class="removeBtn">Remove</button>
    `;

    tempDiv.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => saveCurrentClassData());
    });

    tempDiv.querySelector(".removeBtn").addEventListener("click", () => {
        tempDiv.remove();
        saveCurrentClassData();
    });

    document.getElementById("weightedContainer").appendChild(tempDiv);
}

function createPoint(data = {}) {
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("pointField");

    tempDiv.innerHTML = `
        <input type="text" placeholder="Assignment" value="${data.name || ''}">
        <input type="number" class="pointGot" placeholder="Points you got" value="${data.got || ''}" step="0.01">
        <input type="number" class="maxPoint" placeholder="Max points" value="${data.max || ''}" step="0.01">
        <button class="removeBtn">Remove</button>
    `;

    tempDiv.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => saveCurrentClassData());
    });

    tempDiv.querySelector(".removeBtn").addEventListener("click", () => {
        tempDiv.remove();
        saveCurrentClassData();
    });

    document.getElementById("pointContainer").appendChild(tempDiv);
}

function saveCurrentClassData() {
    if (!currentClassId) return;
    
    const classData = getClassData(currentClassId);
    if (!classData) return;
    
    // Save weight data
    classData.weightData = Array.from(document.querySelectorAll(".weightField")).map(field => ({
        name: field.querySelector("input[type='text']").value,
        grade: field.querySelector(".gradeGot").value,
        weight: field.querySelector(".weight").value
    }));
    
    // Save point data
    classData.pointData = Array.from(document.querySelectorAll(".pointField")).map(field => ({
        name: field.querySelector("input[type='text']").value,
        got: field.querySelector(".pointGot").value,
        max: field.querySelector(".maxPoint").value
    }));
    
    saveClassData(classData);
}

// History functions
function saveCalculation(type, grade, className) {
    const history = JSON.parse(localStorage.getItem("gradeCalculatorHistory") || "[]");
    const calculation = {
        id: Date.now().toString(),
        type,
        grade,
        className,
        classId: currentClassId,
        date: new Date().toLocaleString(),
        data: type === 'weight' ? 
            Array.from(document.querySelectorAll(".weightField")).map(field => ({
                name: field.querySelector("input[type='text']").value,
                grade: field.querySelector(".gradeGot").value,
                weight: field.querySelector(".weight").value
            })) :
            Array.from(document.querySelectorAll(".pointField")).map(field => ({
                name: field.querySelector("input[type='text']").value,
                got: field.querySelector(".pointGot").value,
                max: field.querySelector(".maxPoint").value
            }))
    };
    
    history.unshift(calculation);
    localStorage.setItem("gradeCalculatorHistory", JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem("gradeCalculatorHistory") || []);
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    
    if (history.length === 0) {
        historyList.innerHTML = "<p>No calculation history found.</p>";
        return;
    }
    
    history.forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.className = "historyItem";
        
        historyItem.innerHTML = `
            <h3>${item.className} - ${item.type === 'weight' ? 'Weight-Based' : 'Point-Based'} Grade</h3>
            <p>Date: ${item.date}</p>
            <p>Final Grade: ${item.grade}%</p>
            <div class="history-actions">
                <button class="viewHistoryDetails" data-id="${item.id}">View Details</button>
                <button class="loadHistoryData" data-id="${item.id}">Load Data</button>
                <button class="delete-history-btn deleteHistoryItem" data-id="${item.id}">Delete</button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
    
    // Add event listeners
    document.querySelectorAll(".viewHistoryDetails").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            viewHistoryDetails(id);
        });
    });
    
    document.querySelectorAll(".loadHistoryData").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            loadHistoryData(id);
        });
    });
    
    document.querySelectorAll(".deleteHistoryItem").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            deleteHistoryItem(id);
        });
    });
}

// Add to setupEventListeners:
document.getElementById("clearAllHistory").addEventListener("click", clearAllHistory);

function viewHistoryDetails(id) {
    const history = JSON.parse(localStorage.getItem("gradeCalculatorHistory") || []);
    const item = history.find(i => i.id === id);
    if (!item) return;
    
    let details = `<h3>${item.className} - ${item.type === 'weight' ? 'Weight-Based' : 'Point-Based'} Grade</h3>`;
    details += `<p>Calculated on: ${item.date}</p>`;
    details += `<p>Final Grade: ${item.grade}%</p>`;
    
    if (item.type === 'weight') {
        details += "<h4>Assignments:</h4><ul>";
        item.data.forEach(assignment => {
            details += `<li>${assignment.name || 'Unnamed'}: Grade ${assignment.grade}% (Weight ${assignment.weight}%)</li>`;
        });
        details += "</ul>";
    } else {
        details += "<h4>Assignments:</h4><ul>";
        item.data.forEach(assignment => {
            details += `<li>${assignment.name || 'Unnamed'}: ${assignment.got} / ${assignment.max} points</li>`;
        });
        details += "</ul>";
    }
    
    alert(details);
}

function loadHistoryData(id) {
    const history = JSON.parse(localStorage.getItem("gradeCalculatorHistory") || []);
    const item = history.find(i => i.id === id);
    if (!item) return;
    
    // Show the calculator view for the class
    showCalculator(item.classId);
    
    // Clear current inputs
    document.getElementById("weightedContainer").innerHTML = "";
    document.getElementById("pointContainer").innerHTML = "";
    
    // Load the data
    if (item.type === 'weight') {
        // Switch to weight view
        document.getElementById("pointGrade").classList.add("hide");
        document.getElementById("weightGrade").classList.remove("hide");
        currentGradeType = 'weight';
        
        // Create fields
        item.data.forEach(data => createWeight(data));
    } else {
        // Switch to point view
        document.getElementById("weightGrade").classList.add("hide");
        document.getElementById("pointGrade").classList.remove("hide");
        currentGradeType = 'point';
        
        // Create fields
        item.data.forEach(data => createPoint(data));
    }
    
    // Save the loaded data to the class
    saveCurrentClassData();
}


function deleteCurrentClass() {
    if (!currentClassId) return;
    
    if (confirm("Are you sure you want to delete this class? All data will be lost.")) {
        const classes = getClasses();
        const updatedClasses = classes.filter(c => c.id !== currentClassId);
        saveClasses(updatedClasses);
        showClassSelection();
    }
}

// Function to delete a class from the class selection view
function deleteClass(classId, event) {
    event.stopPropagation(); // Prevent triggering the card click
    
    if (confirm("Are you sure you want to delete this class? All data will be lost.")) {
        const classes = getClasses();
        const updatedClasses = classes.filter(c => c.id !== classId);
        saveClasses(updatedClasses);
        loadClasses();
    }
}

// Update the loadClasses function to include delete buttons:
function loadClasses() {
    const classes = getClasses();
    classList.innerHTML = "";
    
    if (classes.length === 0) {
        classList.innerHTML = "<p>No classes found. Create your first class!</p>";
        return;
    }
    
    classes.forEach(cls => {
        const classCard = document.createElement("div");
        classCard.className = "classCard";
        
        const cardContent = document.createElement("div");
        cardContent.textContent = cls.name;
        cardContent.style.flexGrow = "1";
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-class-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", (e) => deleteClass(cls.id, e));
        
        classCard.appendChild(cardContent);
        classCard.appendChild(deleteBtn);
        classCard.addEventListener("click", () => showCalculator(cls.id));
        
        classList.appendChild(classCard);
    });
}

function deleteHistoryItem(id) {
    const history = JSON.parse(localStorage.getItem("gradeCalculatorHistory") || []);
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem("gradeCalculatorHistory", JSON.stringify(updatedHistory));
    loadHistory(); // Refresh the history view
}

function clearAllHistory() {
    if (confirm("Are you sure you want to delete ALL history? This cannot be undone.")) {
        localStorage.removeItem("gradeCalculatorHistory");
        loadHistory(); // Refresh the history view
    }
}


// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);