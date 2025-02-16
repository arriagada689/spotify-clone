const validateUserInput = ( username, password, confirm_password ) => {
    //Check if empty inputs
    if (!username || !password || !confirm_password) {
        return { isValid: false, error: 'Please fill in all fields' };
    }

    // Check the length of the username
    if (username.length > 150) {
        return { isValid: false, error: 'Username must be 150 characters or fewer.' };
    }

    // Check for allowed characters
    if (!/^[a-zA-Z0-9@.+/_-]+$/.test(username)) {
        return { isValid: false, error: 'Username must contain only letters, digits, and @/./+/-/_' };
    }

    //Check password length
    if (password.length < 4) {
        return { isValid: false, error: 'Password must be at least 4 characters long' };
    }

    //Check if passwords match
    if (password !== confirm_password) {
        return { isValid: false, error: "Passwords don't match" };
    }

    return { isValid: true };
};

export default validateUserInput