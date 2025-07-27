let entries = JSON.parse(localStorage.getItem("entries")) || [];

const entryForm = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const entryList = document.getElementById("entry-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");

function updateSummary() {
  const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  netBalanceEl.textContent = income - expense;
}

function saveToLocalStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function renderEntries(filter = "all") {
  entryList.innerHTML = "";
  const filtered = entries.filter(e => filter === "all" || e.type === filter);
  filtered.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = `entry-item ${entry.type}`;
    li.innerHTML = `
      <span>${entry.description} - ₹${entry.amount}</span>
      <span class="entry-actions">
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </span>
    `;
    entryList.appendChild(li);
  });
  updateSummary();
}

function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeSelect.value = entry.type;
  deleteEntry(index);
}

function deleteEntry(index) {
  entries.splice(index, 1);
  saveToLocalStorage();
  renderEntries(getCurrentFilter());
}

function getCurrentFilter() {
  return document.querySelector('input[name="filter"]:checked').value;
}

entryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (description && !isNaN(amount) && amount > 0) {
    entries.push({ description, amount, type });
    saveToLocalStorage();
    renderEntries(getCurrentFilter());
    entryForm.reset();
  }
});

document.getElementById("reset-btn").addEventListener("click", () => {
  entryForm.reset();
});

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener("change", () => renderEntries(getCurrentFilter()));
});

renderEntries();
