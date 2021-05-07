import { LOGIN, LOGOUT } from "./ActionTypes"

const login = user => {
    return {
        type: LOGIN,
        payload: user
    }
}

const logout = _ => {
    return {
        type: LOGOUT
    }
}

export { login, logout }