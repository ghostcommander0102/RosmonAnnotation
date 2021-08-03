import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getById,
    update,
   
};

function login(username, password) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`http://127.0.0.1:8000/api/login/`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            
            try{
                var data = user.text;
                if(data.error)
                    return Promise.reject(data.error);
            } catch(err) {
                
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
            
            
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}



function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`http://127.0.0.1:8000/api/register/`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            if(data.password)
                return Promise.reject("Password field has at least 8 characters.");
            return Promise.reject(error);
        }
        if(data.error)
            return Promise.reject(data.error);

        return data;
    });
}