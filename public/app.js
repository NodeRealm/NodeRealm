async function fetchEvents() {
  const res = await fetch('/events');
  const data = await res.json();
  document.getElementById('events').textContent = JSON.stringify(data, null, 2);
}

async function postEvent(ev) {
  await fetch('/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ev)
  });
  fetchEvents();
}

document.getElementById('birthdayForm').addEventListener('submit', e => {
  e.preventDefault();
  const ev = {
    type: 'birthday',
    name: document.getElementById('bName').value,
    date: document.getElementById('bDate').value,
    notes: document.getElementById('bNotes').value
  };
  postEvent(ev);
  e.target.reset();
});

document.getElementById('dueDateForm').addEventListener('submit', e => {
  e.preventDefault();
  const ev = {
    type: 'dueDate',
    baby: document.getElementById('dBaby').value,
    date: document.getElementById('dDate').value,
    notes: document.getElementById('dNotes').value
  };
  postEvent(ev);
  e.target.reset();
});

document.getElementById('appointForm').addEventListener('submit', e => {
  e.preventDefault();
  const ev = {
    type: 'appointment',
    description: document.getElementById('aDesc').value,
    datetime: document.getElementById('aDate').value,
    notes: document.getElementById('aNotes').value
  };
  postEvent(ev);
  e.target.reset();
});

fetchEvents();
