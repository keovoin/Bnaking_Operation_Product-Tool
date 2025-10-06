// Sample data
const data = {
  individual: [
    { name: 'Product A', type: 'Type 1', segment: 'Segment 1', effectiveDate: '2023-01-01' },
    { name: 'Product B', type: 'Type 2', segment: 'Segment 2', effectiveDate: '2023-02-01' }
  ],
  corporate: [
    { name: 'Corporate Product 1', type: 'Type 1', segment: 'Segment 3', effectiveDate: '2023-03-01' }
  ],
  td: [
    { name: 'TD Product', type: 'Type 3', segment: 'Segment 4', effectiveDate: '2023-04-01' }
  ],
  extra: [
    { name: 'Extra Product', type: 'Type 4', segment: 'Segment 5', effectiveDate: '2023-05-01' }
  ]
};

let currentCategory = 'individual';

// Show category
function showCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  document.getElementById('uploadSection').style.display = (category === 'admin') ? 'block' : 'none';
  renderTable();
}

// Render table
function renderTable() {
  const container = document.getElementById('content');
  container.innerHTML = '';

  if (currentCategory === 'admin') {
    container.innerHTML = '<p style="margin-top:20px;">Upload CSV file in the Admin section above.</p>';
    return;
  }

  const table = document.createElement('table');
  const thead = table.createTHead();
  const headerRow = thead.insertRow();

  ['Name', 'Type', 'Segment', 'Effective Date', 'Actions'].forEach(text => {
    const th = document.createElement('th');
    th.innerText = text;
    headerRow.appendChild(th);
  });

  const tbody = document.createElement('tbody');

  (data[currentCategory] || []).forEach((item, index) => {
    const row = tbody.insertRow();

    row.insertCell().innerText = item.name;
    row.insertCell().innerText = item.type;
    row.insertCell().innerText = item.segment;
    row.insertCell().innerText = item.effectiveDate;

    // Actions
    const actionsCell = row.insertCell();
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.className = 'action-btn edit-btn';
    editBtn.onclick = () => openModal('edit', index);
    actionsCell.appendChild(editBtn);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Filter table
function filterTable() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const filterCategory = document.getElementById('categoryFilter').value;
  const tbody = document.querySelector('#content table tbody');

  if (!tbody) return;

  Array.from(tbody.rows).forEach(row => {
    const name = row.cells[0].innerText.toLowerCase();
    const segment = row.cells[2].innerText.toLowerCase();

    const matchesSearch = name.includes(input) || segment.includes(input);
    const matchesCategory = !filterCategory || filterCategory === currentCategory;

    row.style.display = matchesSearch && matchesCategory ? '' : 'none';
  });
}

// Modal controls
const modal = document.getElementById('modal');

function openModal(mode, index = null) {
  document.getElementById('productForm').reset();
  document.getElementById('productIndex').value = index !== null ? index : '';
  document.getElementById('modalTitle').innerText = mode === 'edit' ? 'Edit Product' : 'Add Product';

  if (mode === 'edit' && index !== null) {
    const item = data[currentCategory][index];
    document.getElementById('name').value = item.name;
    document.getElementById('type').value = item.type;
    document.getElementById('segment').value = item.segment;
    document.getElementById('effectiveDate').value = item.effectiveDate;
  }

  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

// Save data from modal
document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const index = document.getElementById('productIndex').value;
  const newItem = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    segment: document.getElementById('segment').value,
    effectiveDate: document.getElementById('effectiveDate').value
  };

  if (index === '') {
    // Add new
    data[currentCategory].push(newItem);
  } else {
    // Edit existing
    data[currentCategory][index] = newItem;
  }
  closeModal();
  renderTable();
});

// Upload CSV
function uploadData() {
  const fileInput = document.getElementById('uploadFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a CSV file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    lines.forEach(line => {
      const [name, type, segment, effectiveDate] = line.split(',');
      if (name && type && segment && effectiveDate) {
        data[currentCategory].push({ name, type, segment, effectiveDate });
      }
    });
    renderTable();
  };
  reader.readAsText(file);
}

// Initialize
showCategory('individual');
