let products = [];

// Load XML when the page is ready
document.addEventListener("DOMContentLoaded", () => {
    loadProductsXML();
    const form = document.getElementById("search-form");
    form.addEventListener("submit", handleSearch);
});

// Fetch and parse XML file
function loadProductsXML() {
    fetch("products.xml")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load products.xml");
            }
            return response.text();
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            const productNodes = Array.from(xmlDoc.getElementsByTagName("product"));

            products = productNodes.map(node => ({
                category: node.getElementsByTagName("category")[0].textContent,
                code: node.getElementsByTagName("code")[0].textContent,
                name: node.getElementsByTagName("name")[0].textContent,
                description: node.getElementsByTagName("description")[0].textContent,
                quantity: parseInt(node.getElementsByTagName("quantity")[0].textContent, 10),
                unitPrice: parseFloat(node.getElementsByTagName("unitPrice")[0].textContent)
            }));

            renderProductsTable(products);
        })
        .catch(error => {
            const container = document.getElementById("products-container");
            container.innerHTML = `<div class="message error">${error.message}</div>`;
        });
}

// Render full product table
function renderProductsTable(data) {
    const container = document.getElementById("products-container");
    if (!data.length) {
        container.innerHTML = "<p>No products found in XML file.</p>";
        return;
    }

    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price (€)</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(p => {
        tableHtml += `
            <tr>
                <td>${p.category}</td>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${p.description}</td>
                <td>${p.quantity}</td>
                <td>${p.unitPrice.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHtml += "</tbody></table>";
    container.innerHTML = tableHtml;
}

// Handle search form submit
function handleSearch(event) {
    event.preventDefault();

    const input = document.getElementById("product-code");
    const messageDiv = document.getElementById("search-message");
    const resultDiv = document.getElementById("search-result");

    const code = input.value.trim();

    // Basic validation: not empty, matches ###-## pattern
    const codePattern = /^\d{3}-\d{2}$/;

    if (code === "") {
        showMessage(messageDiv, "Please enter a product code.", "error");
        resultDiv.innerHTML = "";
        return;
    }

    if (!codePattern.test(code)) {
        showMessage(messageDiv, "Invalid format. Use ###-## (e.g. 101-01).", "error");
        resultDiv.innerHTML = "";
        return;
    }

    const product = products.find(p => p.code === code);

    if (!product) {
        showMessage(messageDiv, `No product found with code ${code}.`, "error");
        resultDiv.innerHTML = "";
    } else {
        showMessage(messageDiv, `Product ${code} found.`, "success");
        resultDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${product.category}</td>
                        <td>${product.code}</td>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.quantity}</td>
                        <td>${product.unitPrice.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}

// Helper to show feedback messages
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = "block";
}

