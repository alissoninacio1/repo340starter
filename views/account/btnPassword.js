// showPassword.js

document.addEventListener("DOMContentLoaded", function() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(function(passwordInput) {
        const showPasswordButton = document.createElement('button');
        showPasswordButton.textContent = 'Show Password';
        showPasswordButton.type = 'button';
        
        showPasswordButton.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                showPasswordButton.textContent = 'Hide Password';
            } else {
                passwordInput.type = 'password';
                showPasswordButton.textContent = 'Show Password';
            }
        });
        
        passwordInput.insertAdjacentElement('afterend', showPasswordButton);
    });
});
