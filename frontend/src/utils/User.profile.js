export const getUsername = () => {
    return window.sessionStorage.getItem("username");
}

export const setUsername = (username) => {
    window.sessionStorage.setItem("username", username);
}

export const setUserId = (id) => {
    window.sessionStorage.setItem("userId", id);
}

export const getUserId = () => {
    return window.sessionStorage.getItem('userId');
}

export const getRole = () => {
    return window.sessionStorage.getItem("role");
}

export const setRole = (role_id) => {
    window.sessionStorage.setItem("role", role_id);
}

export const logout = () => {
    window.sessionStorage.clear();
}

export const isAuthed = () => {
    if (window.sessionStorage.getItem("username") === null || window.sessionStorage.getItem("userId") === null) {
        return false;
    }
    return true;
}
