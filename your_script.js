// API URLs for Users, Students, Movies, and Products
const API_URL_USERS = "https://finalproject.site/api/v1/users";
const API_URL_STUDENTS = "https://finalproject.site/api/v1/students";
const API_URL_MOVIES = "https://finalproject.site/api/v1/movies";
const API_URL_PRODUCTS = "https://finalproject.site/api/v1/products";

// Generic Fetch Function
function fetchData(url, listElementId, createRowCallback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const listElement = document.getElementById(listElementId);
            listElement.innerHTML = ""; // Clear existing data
            data.forEach(item => {
                listElement.innerHTML += createRowCallback(item);
            });
        })
        .catch(error => console.error(`Error fetching data from ${url}:`, error));
}

// Generic Save Function
function saveData(url, formData, fetchCallback) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(() => {
            alert("Data saved successfully");
            fetchCallback(); // Refresh list
        })
        .catch(error => console.error(`Error saving data to ${url}:`, error));
}

// Generic Delete Function
function deleteData(url, fetchCallback) {
    if (confirm("Are you sure you want to delete this item?")) {
        fetch(url, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    alert("Item deleted successfully.");
                    fetchCallback(); // Refresh list
                } else {
                    throw new Error("Failed to delete item.");
                }
            })
            .catch(error => console.error(`Error deleting data from ${url}:`, error));
    }
}

// Generic Edit Function
function editData(url, formData, fetchCallback) {
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(() => {
            alert("Data updated successfully");
            fetchCallback(); // Refresh list
        })
        .catch(error => console.error(`Error updating data at ${url}:`, error));
}

// Row Templates with Edit and Delete
function createUserRow(user) {
    return `
        <tr>
            <td>${user.id}</td>
            <td>${user.fname}</td>
            <td>${user.lname}</td>
            <td>${user.email}</td>
            <td>${user.phone_number}</td>
            <td>${user.address}</td>
            <td>${user.city}</td>
            <td>${user.postal_code}</td>
            <td>${user.created_at}</td>
            <td>${user.updated_at}</td>
            <td>
                <button onclick="startEditUser(${user.id}, '${user.fname}', '${user.lname}', '${user.email}', '${user.phone_number}', '${user.address}', '${user.city}', '${user.postal_code}')">Edit</button>
                <button onclick="deleteData('${API_URL_USERS}/${user.id}', () => fetchData(API_URL_USERS, 'userList', createUserRow))">Delete</button>
            </td>
        </tr>
    `;
}

// Start Edit Process for Users
function startEditUser(id, fname, lname, email,  phone_number, address, city, postal_code) {
    document.getElementById("userFName").value = fname;
    document.getElementById("userLName").value = lname;
    document.getElementById("userEmail").value = email;
    document.getElementById("userPhoneNumber").value = phone_number;
    document.getElementById("userAddress").value = address;
    document.getElementById("userCity").value = city;
    document.getElementById("userPostalCode").value = postal_code;

    const submitButton = document.getElementById("submitButton");
    submitButton.textContent = "Update User";
    submitButton.onclick = function () {
        const updatedUser = {
            fname: document.getElementById("userFName").value,
            lname: document.getElementById("userLName").value,
            email: document.getElementById("userEmail").value,
            phone_number: document.getElementById("userPhoneNumber").value,
            address: document.getElementById("userAddress").value,
            city: document.getElementById("userCity").value,
            postal_code: document.getElementById("userPostalCode").value,
        };
        editData(`${API_URL_USERS}/${id}`, updatedUser, () => fetchData(API_URL_USERS, "userList", createUserRow));
    };
}

// Fetch and display data for all categories
fetchData(API_URL_USERS, "userList", createUserRow);

// Form Submission for Adding a New User
document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = {
        fname: document.getElementById("userFName").value,
        lname: document.getElementById("userLName").value,
        email: document.getElementById("userEmail").value,
        phone_number: document.getElementById("userPhoneNumber").value,
        address: document.getElementById("userAddress").value,
        city: document.getElementById("userCity").value,
        postal_code: document.getElementById("userPostalCode").value,
    };
    saveData(API_URL_USERS, user, () => fetchData(API_URL_USERS, "userList", createUserRow));
});
