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

function showCategory(category) {
  currentCategory = category;
  document.getElementById('adminSection').style.display = (category === 'admin') ? 'block' : 'none';
  renderTable();
}

function renderTable() {
  const container = document.getElementById('content');
  container.innerHTML = '';

  if (currentCategory === 'admin') {
    container.innerHTML = '<p>Admin functions: upload data via the file input above.</p>';
    return;
  }

  const table = document.createElement('table');
  const header = table.createTHead();
  const headerRow = header.insertRow();

  const columns = ['Name', 'Type', 'Segment', 'Effective Date'];
  columns.forEach(col => {
    const th = document.createElement('th');
    th.innerText = col;
    headerRow.appendChild(th);
  });

  const tbody = document.createElement('tbody');

  (data[currentCategory] || []).forEach(item => {
    const row = tbody.insertRow();
    row.insertCell().innerText = item.name;
    row.insertCell().innerText = item.type;
    row.insertCell().innerText = item.segment;
    row.insertCell().innerText = item.effectiveDate;
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

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

function uploadData() {
  const fileInput = document.getElementById('uploadFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file to upload.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataStr = e.target.result;
    // For simplicity, assume CSV format
    const lines = dataStr.split('\n');
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
