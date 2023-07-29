export const setToken = (token)=>{
    localStorage.setItem('TOKEN', token)
}
export const getToken = ()=>{
    return localStorage.getItem('TOKEN')
}
export const delToken = ()=>{
    localStorage.removeItem('TOKEN')
}