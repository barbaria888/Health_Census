const addpat = document.getElementById("addPatient");
const report = document.getElementById("report");
const serch = document.getElementById("btnSearch");
const patients = [];

function addPatient() {
	const name = document.getElementById("name").value;
	const gender = document.querySelector('input[name="gender"]:checked');
	const age = document.getElementById("age").value;
	const condition = document.getElementById("condition").value;

	if (name && gender && age && condition) {
		patients.push({ name, gender: gender.value, age, condition });
		resetForm();
		generateReport();
	} else {
		report.innerHTML = "Kindly fill all the fields"; // Improved user feedback
	}
}

function resetForm() {
	document.getElementById("name").value = "";
	const genderInputs = document.querySelectorAll('input[name="gender"]');
	genderInputs.forEach((input) => {
		input.checked = false;
	});
	document.getElementById("age").value = "";
	document.getElementById("condition").value = "";
}

function generateReport() {
	const numpatients = patients.length;
	if (numpatients === 0) {
		report.innerHTML = "No patients added yet."; // Handle empty patient list
		return;
	}

	const conditionsCount = {
		Diabetes: 0,
		Thyroid: 0,
		HighBloodPressure: 0, // Ensure the key matches the dropdown value
	};

	const genderCount = {
		Male: { Diabetes: 0, Thyroid: 0, HighBloodPressure: 0 },
		Female: { Diabetes: 0, Thyroid: 0, HighBloodPressure: 0 },
	};

	for (const patient of patients) {
		conditionsCount[patient.condition]++;
		genderCount[patient.gender][patient.condition]++;
	}

	let reportContent = `Number of patients: ${numpatients}<br><br>Conditions Breakdown:<br>`;

	for (const gender in genderCount) {
		reportContent += `${gender}:<br>`;
		for (const condition in conditionsCount) {
			reportContent += `&nbsp;&nbsp;${condition}: ${genderCount[gender][condition]}<br>`;
		}
	}
	report.innerHTML = reportContent; // Set report content once for performance
}

// Function to search for a medical condition
function searchCondition() {
	const input = document.getElementById("conditionInput").value.toLowerCase(); // Taking input from user
	const result = document.getElementById("result");
	let out = "";

	fetch(
		"https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-JS0101EN-SkillsNetwork/health1.json"
	)
		.then((response) => response.json()) // Promise
		.then((data) => {
			if (data && data.conditions) {
				const condition = data.conditions.find(
					(item) => item.name.toLowerCase() === input
				);
				if (condition) {
					// Fetching from JSON
					const symptoms = condition.symptoms.join(", ");
					const prevention = condition.prevention.join(", ");
					const treatment = condition.treatment;
					out = "";
					// Heading
					out += `<h2>${condition.name}</h2>`;
					// Image from JSON
					let img = "";
					if (condition === "diabetes") {
						img = "./FINAL_PRACTICE_PROJECT/Assets/Diabetes.png";
					}
					if (condition === "thyroid") {
						img = "./FINAL_PRACTICE_PROJECT/Assets/Thyroid.png";
					}
					if (condition === "high blood pressure") {
						img = "./FINAL_PRACTICE_PROJECT/Assets/BloodPressure.png";
					}
					out += `<img src="${img}" alt="${condition.imagesrc}">`;
					// Details
					out += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
					out += `<p><strong>Prevention:</strong> ${prevention}</p>`;
					out += `<p><strong>Treatment:</strong> ${treatment}</p>`;
					result.innerHTML = out;
				} else {
					out = "Condition Not Found!";
					result.innerHTML = out;
				}
			} else {
				out = "No conditions data available!";
				result.innerHTML = out;
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			out = "An error occurred while fetching data."; // Improved error message
			result.innerHTML = out;
		});
}

// Event listeners for buttons
serch.addEventListener("click", searchCondition);
addpat.addEventListener("click", addPatient);
