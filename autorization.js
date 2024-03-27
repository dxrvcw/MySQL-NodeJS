let passwordLabel = document.getElementById("password");
let loginLabel = document.getElementById("login");
let submitBtn = document.querySelector(".submit-btn");
let errorContainer = document.querySelector(".error");

submitBtn.addEventListener("click", (event) => {
	event.preventDefault();
	let password = passwordLabel.value;
	let login = loginLabel.value;
	getAutorization(login, password);
});

function getAutorization(login, password) {
	fetch(
		`http://localhost:8080/autorization?login=${login}&password=${password}`
	).then((response) => {
		if (!response.ok) {
			errorContainer.classList.remove("hidden");
			setTimeout(() => {
				errorContainer.classList.add("hidden");
			}, 1500);
			return;
		}
		if (response.status === 200) {
			window.location.href = "index.html";
		}
	});
}
