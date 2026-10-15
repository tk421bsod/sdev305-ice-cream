function formSubmit(event) {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let flavor = document.getElementById('flavor').value;
    let selectedCone = document.querySelector('cones > input:checked');
    if (!selectedCone){
        event.preventDefault();
        return
    }   
}