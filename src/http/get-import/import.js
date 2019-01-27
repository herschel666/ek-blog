const MAX_SIZE = 1000000; // ~1MB

const hiddenInput = document.getElementById('hidden-input');
const fileInput = document.getElementById('file-input');
const [button] = document.getElementsByTagName('button');

fileInput.addEventListener('change', (evnt) => {
  const [blob] = evnt.srcElement.files;

  if (blob.size > MAX_SIZE) {
    alert('Datei zu groß.');
    return;
  }

  const reader = Object.assign(new FileReader(), {
    onload: (evnt) => {
      hiddenInput.value = btoa(evnt.target.result);
      button.removeAttribute('disabled');
    },
    onerror: console.error,
  });

  reader.readAsBinaryString(blob);
});
