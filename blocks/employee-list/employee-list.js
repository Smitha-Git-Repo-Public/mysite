import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

// Default source when the author does not provide one.
const DEFAULT_SOURCE = '/employees.json';
// Number of rows revealed per page / per "Load more" click.
const PAGE_SIZE = 10;
// Columns rendered, in order. Keys match the sheet's column headers.
const COLUMNS = ['Name', 'Department', 'Experience', 'City'];

/**
 * Resolves the JSON source for the block.
 * The author may provide a link or a plain path in the first cell; otherwise we
 * fall back to the default published sheet.
 * @param {Element} block The employee-list block element
 * @returns {string} URL/path to the employees JSON
 */
function getSource(block) {
  const link = block.querySelector('a[href]');
  if (link) return link.getAttribute('href');
  const text = block.textContent.trim();
  return text || DEFAULT_SOURCE;
}

/**
 * Fetches the employee rows from the published JSON sheet.
 * @param {string} source URL/path to the JSON
 * @returns {Promise<Array<object>>} the array of employee rows (empty on error)
 */
async function fetchEmployees(source) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    // AEM sheets wrap rows in a `data` array; be tolerant of a bare array too.
    return Array.isArray(json) ? json : (json.data || []);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`employee-list: failed to load ${source}`, error);
    return [];
  }
}

/**
 * Builds the table shell with a header row.
 * @returns {{ table: HTMLTableElement, tbody: HTMLTableSectionElement }}
 */
function buildTable() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  COLUMNS.forEach((col) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = col;
    headRow.append(th);
  });
  thead.append(headRow);
  const tbody = document.createElement('tbody');
  table.append(thead, tbody);
  return { table, tbody };
}

/**
 * Appends up to PAGE_SIZE rows to the table body starting at `offset`.
 * @param {HTMLTableSectionElement} tbody Table body to append into
 * @param {Array<object>} employees All employee rows
 * @param {number} offset Index of the first row to render
 * @returns {number} the new offset after appending
 */
function appendRows(tbody, employees, offset) {
  const next = employees.slice(offset, offset + PAGE_SIZE);
  next.forEach((employee) => {
    const tr = document.createElement('tr');
    COLUMNS.forEach((col) => {
      const td = document.createElement('td');
      td.dataset.column = col;
      td.textContent = employee[col] ?? '';
      tr.append(td);
    });
    tbody.append(tr);
  });
  return offset + next.length;
}

/**
 * loads and decorates the employee list
 * @param {Element} block The employee-list block element
 */
export default async function decorate(block) {
  const source = getSource(block);
  const [placeholders, employees] = await Promise.all([
    fetchPlaceholders().catch(() => ({})),
    fetchEmployees(source),
  ]);

  block.textContent = '';

  if (!employees.length) {
    const empty = document.createElement('p');
    empty.className = 'employee-list-empty';
    empty.textContent = placeholders.employeeListEmpty || 'No employees to display.';
    block.append(empty);
    return;
  }

  const { table, tbody } = buildTable();
  block.append(table);

  let offset = appendRows(tbody, employees, 0);

  if (offset < employees.length) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'employee-list-load-more';
    button.textContent = placeholders.loadMore || 'Load more';
    button.addEventListener('click', () => {
      offset = appendRows(tbody, employees, offset);
      if (offset >= employees.length) button.remove();
    });
    block.append(button);
  }
}
