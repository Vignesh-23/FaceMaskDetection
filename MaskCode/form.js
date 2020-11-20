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

imageForm.onsubmit = async (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/getImage', {
      method: 'POST',
	  body: new FormData(imageForm),
	}).then(response => response.text())
	.then(data =>{
		document.getElementById("textid").value = data;
		console.log(data)});
  };