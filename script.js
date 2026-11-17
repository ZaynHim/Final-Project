const STORAGE_KEY = "frogquest_bookings_v4";

function getExplorers() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data === null) {
    return [];
  }
  return JSON.parse(data);
}

function saveExplorers(explorers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(explorers));
}

function showAlert(containerId, message, type) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  setTimeout(function () {
    container.innerHTML = "";
  }, 3000);
}

const registerForm = document.getElementById("registerForm");
const tableBody = document.getElementById("explorersTableBody");

function renderTable() {
  const explorers = getExplorers();
  const emptyMessage = document.getElementById("emptyMessage");
  const explorerCount = document.getElementById("explorerCount");

  tableBody.innerHTML = "";

  explorerCount.textContent = explorers.length + " explorers";

  if (explorers.length === 0) {
    emptyMessage.classList.remove("d-none");
    return;
  }
  emptyMessage.classList.add("d-none");

  explorers.forEach(function (explorer, index) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${explorer.name}</td>
      <td>${explorer.email}</td>
      <td><span class="badge bg-moss">${explorer.trip}</span></td>
      <td>${explorer.date}</td>
      <td>${explorer.group}</td>
      <td>${explorer.level}</td>
      <td>
        <button class="btn btn-sm btn-outline-success me-1" onclick="editExplorer(${explorer.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteExplorer(${explorer.id})" title="Cancel booking">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function validateRegisterForm(name, email, trip, date, group, level) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name === "" || email === "" || trip === "" || date === "" || group === "" || level === "") {
    showAlert("alertBox", "Please fill in all the fields.", "danger");
    return false;
  }

  if (name.length < 3) {
    showAlert("alertBox", "Name must be at least 3 characters.", "danger");
    return false;
  }

  if (!emailPattern.test(email)) {
    showAlert("alertBox", "That email doesn't look right.", "danger");
    return false;
  }

  if (isNaN(group) || Number(group) < 1 || Number(group) > 10) {
    showAlert("alertBox", "Group size has to be between 1 and 10 people.", "danger");
    return false;
  }

  return true;
}

function resetForm() {
  registerForm.reset();
  document.getElementById("explorerId").value = "";
  document.getElementById("formTitle").textContent = "New Booking";
  document.getElementById("saveBtn").innerHTML = '<i class="bi bi-plus-circle"></i> Save Booking';
  document.getElementById("cancelBtn").classList.add("d-none");
}

function handleRegisterSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("explorerId").value;
  const name = document.getElementById("explorerName").value.trim();
  const email = document.getElementById("explorerEmail").value.trim();
  const trip = document.getElementById("explorerTrip").value;
  const date = document.getElementById("explorerDate").value;
  const group = document.getElementById("explorerGroup").value;
  const level = document.getElementById("explorerLevel").value;

  if (!validateRegisterForm(name, email, trip, date, group, level)) {
    return;
  }

  const explorers = getExplorers();

  if (id === "") {
    const newExplorer = {
      id: Date.now(),
      name: name,
      email: email,
      trip: trip,
      date: date,
      group: Number(group),
      level: level
    };
    explorers.push(newExplorer);
    saveExplorers(explorers);
    showAlert("alertBox", "You're booked, " + name + ". See you at the pond!", "success");
  } else {
    const index = explorers.findIndex(function (e) {
      return e.id === Number(id);
    });

    if (index !== -1) {
      explorers[index].name = name;
      explorers[index].email = email;
      explorers[index].trip = trip;
      explorers[index].date = date;
      explorers[index].group = Number(group);
      explorers[index].level = level;
      saveExplorers(explorers);
      showAlert("alertBox", "Booking updated.", "success");
    }
  }

  resetForm();
  renderTable();
}

function editExplorer(id) {
  const explorers = getExplorers();
  const explorer = explorers.find(function (e) {
    return e.id === id;
  });

  if (!explorer) return;

  document.getElementById("explorerId").value = explorer.id;
  document.getElementById("explorerName").value = explorer.name;
  document.getElementById("explorerEmail").value = explorer.email;
  document.getElementById("explorerTrip").value = explorer.trip;
  document.getElementById("explorerDate").value = explorer.date;
  document.getElementById("explorerGroup").value = explorer.group;
  document.getElementById("explorerLevel").value = explorer.level;

  document.getElementById("formTitle").textContent = "Edit Booking";
  document.getElementById("saveBtn").innerHTML = '<i class="bi bi-check-circle"></i> Save Changes';
  document.getElementById("cancelBtn").classList.remove("d-none");

  registerForm.scrollIntoView({ behavior: "smooth" });
}

function deleteExplorer(id) {
  const confirmed = confirm("Cancel this booking?");
  if (!confirmed) return;

  let explorers = getExplorers();

  explorers = explorers.filter(function (e) {
    return e.id !== id;
  });

  saveExplorers(explorers);
  renderTable();
  showAlert("alertBox", "Booking cancelled.", "warning");
}

function addSampleExplorers() {
  if (localStorage.getItem(STORAGE_KEY) !== null) return;

  const samples = [
    { id: 1, name: "Raneem", email: "raneem@sdkjordan.com", trip: "Night Pond Walk", date: "2026-12-04", group: 2, level: "Beginner" },
    { id: 2, name: "Sewar Shorman", email: "sewar@sdkjordan.com", trip: "Wetland Day Trip", date: "2026-12-05", group: 3, level: "Intermediate" },
    { id: 3, name: "Zayn Momany", email: "zayn@frogquest.com", trip: "Azraq Oasis Expedition", date: "2026-12-12", group: 1, level: "Expert" }
  ];

  saveExplorers(samples);
}

const contactForm = document.getElementById("contactForm");

function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const subject = document.getElementById("contactSubject").value;
  const message = document.getElementById("contactMessage").value.trim();

  if (name === "" || email === "" || subject === "" || message === "") {
    showAlert("contactAlert", "Please fill in all the fields.", "danger");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showAlert("contactAlert", "That email doesn't look right.", "danger");
    return;
  }

  if (message.length < 10) {
    showAlert("contactAlert", "Your message is too short, write at least 10 characters.", "danger");
    return;
  }

  const messages = JSON.parse(localStorage.getItem("frogquest_messages")) || [];
  messages.push({
    name: name,
    email: email,
    subject: subject,
    message: message,
    date: new Date().toLocaleString("en-GB")
  });
  localStorage.setItem("frogquest_messages", JSON.stringify(messages));

  showAlert("contactAlert", "Thanks " + name + ", got it. I'll get back to you soon.", "success");
  contactForm.reset();
}

if (registerForm) {
  addSampleExplorers();
  renderTable();
  registerForm.addEventListener("submit", handleRegisterSubmit);
  document.getElementById("cancelBtn").addEventListener("click", resetForm);
}

if (contactForm) {
  contactForm.addEventListener("submit", handleContactSubmit);
}