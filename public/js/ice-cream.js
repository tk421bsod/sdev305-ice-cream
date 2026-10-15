function formSubmit(event) {
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let emailIsDefinitelyInvalid = false;
    if (email){
        emailIsDefinitelyInvalid = !email.includes("@");
    }
    let flavor = document.getElementById('flavor').value;
    let selectedCone = document.querySelector('cones > input:checked');
    let errorElement = document.getElementById('err');
    let validationConditions = [name, email, !emailIsDefinitelyInvalid, flavor, selectedCone];
    let errorMessages = ["Please enter a name.", "Please enter an email address.", "Please enter a valid email address.", "Please select a flavor.", "Please select a cone type."];
    for (let i = 0; i < validationConditions.length; i++) {
        console.log(validationConditions[i]);
        if (!validationConditions[i]) {
            event.preventDefault();
            errorElement.innerHTML = errorMessages[i];
            return;
        }
    }
}

document.getElementById('main-form').addEventListener("submit", formSubmit);