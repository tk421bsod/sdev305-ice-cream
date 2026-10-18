function formSubmit(event) {
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let emailIsDefinitelyInvalid = false;
    if (email){
        emailIsDefinitelyInvalid = !email.includes("@");
    }
    let flavor = document.getElementById('flavor').value != "Select a flavor...";
    let selectedCone = document.querySelector('#cones > input:checked');
    let errorElement = document.getElementById('err');
    let validationConditions = [name, flavor, selectedCone, email, !emailIsDefinitelyInvalid];
    let errorMessages = ["Please enter a name.", "Please select a flavor.", "Please select a cone type.", "Please enter an email address.", "Please enter a valid email address."];
    errorElement.innerHTML = "";
    for (let i = 0; i < validationConditions.length; i++) {
        if (!validationConditions[i] && !errorElement.innerHTML.includes("email")) {
            event.preventDefault();
            errorElement.innerHTML += errorMessages[i] + "<br>";
        }
    }
}

document.getElementById('main-form').addEventListener("submit", formSubmit);
