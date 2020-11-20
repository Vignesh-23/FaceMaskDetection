function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#imageResult')
				.attr('src', e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

$(function () {
	$('#upload').on('change', function () {
		readURL(input);
	});
});
$('.tipcopied').tooltip({trigger: 'click',placement: 'top'});

var input = document.getElementById('upload');
var infoArea = document.getElementById('upload-label');

input.addEventListener('change', showFileName);
function showFileName(event) {
	var input = event.srcElement;
	var fileName = input.files[0].name;
	infoArea.textContent = 'File name: ' + fileName;
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
	var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null) {
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else {
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}
  
function setTooltip(toolname,message) {
	$(toolname).tooltip('hide')
	  .attr('data-original-title', message)
	  .tooltip('show');
  }
  
function hideTooltip(toolname) {
	setTimeout(function() {
	  $(toolname).tooltip('hide');
	}, 1000);
  }

function copy() {
	let textarea = document.getElementById("textid");
	textarea.select();
	document.execCommand("copy");
	setTooltip('.tipcopied','Copied');
	hideTooltip('.tipcopied');
}

function share() {
	let textarea = {share:document.getElementById("textid").value};
	console.log(textarea);
	fetch('http://localhost:3000/sharetext', {
		method:'POST',
		body: JSON.stringify(textarea),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	})
}

imageForm.onsubmit = async (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/detectimage', {
      method: 'POST',
	  body: new FormData(imageForm),
	}).then(response => response.text())
	.then(data =>{
		document.getElementById("textid").value = data;
		console.log(data)});
  };