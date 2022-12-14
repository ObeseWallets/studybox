let inputTitle = document.querySelector('.new-note input');
let inputBody = document.querySelector('.new-note textarea');

let noteContainer = document.querySelector('.note-container');


let clearBtn = document.querySelector('.clear');
let addBtn = document.querySelector('.add');



addBtn.addEventListener('click', addNote);
clearBtn.addEventListener('click', clearAll);

function onError(error) {
  console.log(error);
}


initialize();

function initialize() {
  let gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    let noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
      let curValue = results[noteKey];
      displayNote(noteKey,curValue);
    }
  }, onError);
}


function addNote() {
  let noteTitle = inputTitle.value;
  let noteBody = inputBody.value;
  let gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    let objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      inputTitle.value = '';
      inputBody.value = '';
      storeNote(noteTitle,noteBody);
    }
  }, onError);
}



function storeNote(title, body) {
  let storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    displayNote(title,body);
  }, onError);
}


function displayNote(title, body) {

 
  let note = document.createElement('div');
  let noteDisplay = document.createElement('div');
  let noteH = document.createElement('h2');
  let notePara = document.createElement('p');
  let deleteBtn = document.createElement('button');
  let clearFix = document.createElement('div');

  note.setAttribute('class','note');

  noteH.textContent = title;
  notePara.textContent = body;
  deleteBtn.setAttribute('class','delete');
  deleteBtn.textContent = 'Delete note';
  clearFix.setAttribute('class','clearfix');

  noteDisplay.appendChild(noteH);
  noteDisplay.appendChild(notePara);
  noteDisplay.appendChild(deleteBtn);
  noteDisplay.appendChild(clearFix);

  note.appendChild(noteDisplay);


  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(title);
  })


  let noteEdit = document.createElement('div');
  let noteTitleEdit = document.createElement('input');
  let noteBodyEdit = document.createElement('textarea');
  let clearFix2 = document.createElement('div');

  let updateBtn = document.createElement('button');
  let cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class','update');
  updateBtn.textContent = 'Update note';
  cancelBtn.setAttribute('class','cancel');
  cancelBtn.textContent = 'Cancel update';

  noteEdit.appendChild(noteTitleEdit);
  noteTitleEdit.value = title;
  noteEdit.appendChild(noteBodyEdit);
  noteBodyEdit.textContent = body;
  noteEdit.appendChild(updateBtn);
  noteEdit.appendChild(cancelBtn);

  noteEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');

  note.appendChild(noteEdit);

  noteContainer.appendChild(note);
  noteEdit.style.display = 'none';

 
  noteH.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  })

  notePara.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  }) 

  cancelBtn.addEventListener('click',() => {
    noteDisplay.style.display = 'block';
    noteEdit.style.display = 'none';
    noteTitleEdit.value = title;
    noteBodyEdit.value = body;
  })

  updateBtn.addEventListener('click',() => {
    if(noteTitleEdit.value !== title || noteBodyEdit.value !== body) {
      updateNote(title,noteTitleEdit.value,noteBodyEdit.value);
      note.parentNode.removeChild(note);
    } 
  });
}


function updateNote(delNote,newTitle,newBody) {
  let storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      let removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayNote(newTitle, newBody);
      }, onError);
    } else {
      displayNote(newTitle, newBody);
    }
  }, onError);
}


function clearAll() {
  while (noteContainer.firstChild) {
      noteContainer.removeChild(noteContainer.firstChild);
  }
  browser.storage.local.clear();
}

// TODO: play, pause lofi music
