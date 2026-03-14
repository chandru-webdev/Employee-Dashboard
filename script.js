let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editIndex = null;

// Helper function to format salary into Indian Rupees (INR)
function formatCurrency(salary) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(salary);
}

// Helper function to handle input validation feedback (UI/UX improvement)
function validateInput(inputElement, value) {
  const wrapper = inputElement.closest('.input-wrapper');
  
  if (wrapper) { // Check if the wrapper exists (it should, based on HTML changes)
    if (value && value !== "" && value !== 0) {
      wrapper.classList.remove('error');
      wrapper.classList.add('success');
      return true;
    } else {
      wrapper.classList.remove('success');
      wrapper.classList.add('error');
      return false;
    }
  }
  // Fallback for non-wrapped inputs
  return value && value !== "" && value !== 0;
}

function renderTable() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";

  // The last employee index is used to apply the 'new-row' animation class
  const lastIndex = employees.length - 1; 

  employees.forEach((emp, index) => {
    const animationClass = index === lastIndex ? 'new-row' : ''; 
    
    const row = `
      <tr class="${animationClass}">
        <td>${index + 1}</td>
        <td>${emp.name}</td>
        <td>${emp.position}</td>
        <td>${formatCurrency(emp.salary)}</td>
        <td>
          <button class="edit-btn" onclick="editEmployee(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteEmployee(${index})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  localStorage.setItem("employees", JSON.stringify(employees));
}

function addEmployee() {
  const nameInput = document.getElementById("name");
  const positionInput = document.getElementById("position");
  const salaryInput = document.getElementById("salary");

  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const salary = salaryInput.value.trim();

  // Validate all fields using the new validation function
  const isNameValid = validateInput(nameInput, name);
  const isPositionValid = validateInput(positionInput, position);
  const isSalaryValid = validateInput(salaryInput, salary);

  if (!isNameValid || !isPositionValid || !isSalaryValid) {
    alert("Please fill all fields!"); 
    return;
  }

  employees.push({ name, position, salary });
  localStorage.setItem("employees", JSON.stringify(employees));
  clearForm();
  // Call renderTable to show the new employee and trigger the animation
  renderTable(); 
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable();
  }
}

function editEmployee(index) {
  const emp = employees[index];
  
  document.getElementById("name").value = emp.name;
  document.getElementById("position").value = emp.position;
  document.getElementById("salary").value = emp.salary;
  
  // Apply success validation classes when editing (since data is present)
  document.querySelectorAll('.input-wrapper input').forEach(input => {
    validateInput(input, input.value);
  });

  document.getElementById("addBtn").style.display = "none";
  document.getElementById("updateBtn").style.display = "inline-block";

  editIndex = index;
}

function updateEmployee() {
  const nameInput = document.getElementById("name");
  const positionInput = document.getElementById("position");
  const salaryInput = document.getElementById("salary");

  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const salary = salaryInput.value.trim();

  // Validate fields before updating
  const isNameValid = validateInput(nameInput, name);
  const isPositionValid = validateInput(positionInput, position);
  const isSalaryValid = validateInput(salaryInput, salary);

  if (!isNameValid || !isPositionValid || !isSalaryValid) {
    alert("Please fill all fields!");
    return;
  }

  employees[editIndex] = { name, position, salary };
  localStorage.setItem("employees", JSON.stringify(employees));

  clearForm();
  renderTable();

  document.getElementById("addBtn").style.display = "inline-block";
  document.getElementById("updateBtn").style.display = "none";
  editIndex = null;
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("position").value = "";
  document.getElementById("salary").value = "";
  
  // Clear validation classes (UI/UX improvement)
  document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    wrapper.classList.remove('success', 'error');
  });
}

// Initial call to populate the table on page load
renderTable();

// Optional: Add a subtle input listener for live validation feedback (UI/UX improvement)
document.querySelectorAll('.form-container input').forEach(input => {
    input.addEventListener('input', (e) => {
        validateInput(e.target, e.target.value.trim());
    });
});