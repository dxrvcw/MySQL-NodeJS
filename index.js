fetchData();

function fetchData() {
	fetch("http://localhost:8080/")
		.then((response) => response.json())
		.then((data) => {
			renderItems(data);
		})
		.catch((error) => console.error("Error fetching data:", error));
}

function renderItems(data) {
	const container = document.querySelector(".sneakers-container");
	container.innerHTML = "";
	for (const item of data) {
		container.innerHTML += `
    <div class="sneaker-item">
			<p class="sneaker-item__title">${item.sneaker_id}. ${item.brand} ${item.model}</p>
			<p class="sneaker-item__desc">${item.description}</p>
			<p class="sneaker-item__price">${item.price}$</p>
      <div class="sneaker-item__info">
				<p class="sneaker-item__size">Size: ${item.size}</p>
				<p class="sneaker-item__color">${item.color}</p>
				<p class="sneaker-item__available-quantity">Quantity: ${item.available_quantity}</p>
        <button class="sneaker-item__button modify-button" id="${item.sneaker_id}">Modify</button>
        <button class="sneaker-item__button delete-button" id="${item.sneaker_id}">Delete</button>
			</div>
		</div>`;
	}
}

function addSneaker(
	brand,
	model,
	color,
	size,
	price,
	description,
	available_quantity
) {
	fetch(
		`http://localhost:8080/add?brand=${brand.split(" ").join("+")}&model=${model
			.split(" ")
			.join("+")}&color=${color
			.split(" ")
			.join("+")}&size=${size}&price=${price}&description=${description
			.split(" ")
			.join("+")}&available_quantity=${available_quantity}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to add sneaker");
			}
			console.log("Sneaker added successfully");
			fetchData();
		})
		.catch((error) => console.error("Error adding sneaker:", error));
}

function modifySneaker(sneakerId, availableQuantity, newPrice) {
	fetch(
		`http://localhost:8080/modify?sneaker_id=${sneakerId}&price=${newPrice}&available_quantity=${availableQuantity}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to modify sneaker");
			}
			console.log("Sneaker modified successfully");
			fetchData();
		})
		.catch((error) => console.error("Error modifying sneaker:", error));
}

function deleteSneaker(sneakerId) {
	fetch(`http://localhost:8080/delete?sneaker_id=${sneakerId}`, {
		method: "DELETE",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to delete sneaker");
			}
			console.log("Sneaker deleted successfully");
			fetchData();
		})
		.catch((error) => console.error("Error deleting sneaker:", error));
}

document.addEventListener("DOMContentLoaded", () => {
	setTimeout(function () {
		const modalModifyWrapper = document.querySelector(".modal-modify-wrapper");
		const modalAddWrapper = document.querySelector(".modal-add-wrapper");

		document.addEventListener("click", (event) => {
			if (event.target.classList.contains("modify-button")) {
				const itemId = event.target.id;

				modalModifyWrapper.innerHTML = `
                    <div class="modify-item-modal" id="${itemId}">
                        <input class="input-label" type="text" id="price" placeholder="Price"  />
                        <input class="input-label" type="text" id="quantity" placeholder="Quantity"/>
                        <button class="modify-item-modal__accept-btn">Accept</button>
                    </div>
                `;
				modalModifyWrapper.classList.toggle("hidden");
			}

			if (event.target.classList.contains("delete-button")) {
				const itemId = event.target.id;
				deleteSneaker(itemId);
			}

			if (event.target.classList.contains("add-item-btn")) {
				modalAddWrapper.classList.toggle("hidden");
			}
		});

		modalAddWrapper.addEventListener("click", (event) => {
			if (event.target === modalAddWrapper) {
				modalAddWrapper.classList.toggle("hidden");
			}
			if (event.target.classList.contains("add-item-modal__add-btn")) {
				let brand = document.getElementById("addBrand").value;
				let model = document.getElementById("addModel").value;
				let desc = document.getElementById("addDesc").value;
				let price = document.getElementById("addPrice").value;
				let size = document.getElementById("addSize").value;
				let color = document.getElementById("addColor").value;
				let quantity = document.getElementById("addQuantity").value;
				addSneaker(brand, model, desc, price, size, color, quantity);
				modalAddWrapper.classList.toggle("hidden");
			}
		});

		modalModifyWrapper.addEventListener("click", (event) => {
			if (event.target === modalModifyWrapper) {
				modalModifyWrapper.classList.toggle("hidden");
			}

			if (event.target.classList.contains("modify-item-modal__accept-btn")) {
				const priceInput = document.getElementById("price");
				const quantityInput = document.getElementById("quantity");
				const newPrice = priceInput.value;
				const newQuantity = quantityInput.value;
				const itemId = event.target.parentElement.id;

				modifySneaker(itemId, newQuantity, newPrice);

				modalModifyWrapper.classList.toggle("hidden");
			}
		});
	}, 1000);
});
