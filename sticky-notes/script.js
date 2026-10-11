const addNoteButton = document.getElementById('add-note');

addNoteButton.addEventListener('mouseover', () => {
    addNoteButton.style.transform = 'scale(1.2)';
});

addNoteButton.addEventListener('mouseout', () => {
    addNoteButton.style.transform = 'scale(1)';
});

const newNote = document.getElementById('new-note');

const notesContainer = document.getElementById('notes-container');

const backgroundColors = ['#d1e1ff', '#fefffe'];
let noteCount = 0;

addNoteButton.addEventListener('click', () => {
    if (newNote.value.trim() === '') return;
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = backgroundColors[noteCount % backgroundColors.length];
    noteCount++;

    const noteContent = document.createElement('p');
    noteContent.textContent = newNote.value;

    note.appendChild(noteContent);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'X';

    note.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        note.remove();
        noteCount--;
    });

    notesContainer.appendChild(note);
    newNote.value = '';
});