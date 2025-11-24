import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL 

export const register = async (body) => {
    const options={
        method:"POST",
        url:`${baseUrl}auth/register`,
        headers:{
            'Content-Type':'application/json'
        },
        data:body
    }
    try{
        const response = await axios.request(options)
        return response.data
    }catch(error){
        // Manejar errores de la petición
        throw error
      
    } 
    
}

export const login = async (body) => {
    const options = {
        method: 'POST',
        url: `${baseUrl}auth/login`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    }
    try {
        const response = await axios.request(options)
        console.log(response.data);
        return response.data
    } catch (error) {
        throw error
    }
}

export const confirmEmail = async (token) => {
    const options = {
        method: 'POST',
        url: `${baseUrl}auth/confirm`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            token: token
        }
    }
    try {
        const response = await axios.request(options)
        return response.data
    } catch (error) {
        if (!navigator.onLine || error.code === 'ERR_NETWORK') {
            saveOffline(options)
        }
        throw error
    }
}

export const favorite = async (body, action) => {
    const options={
        method:"POST",
        url:`${baseUrl}pokemon/${action}Favorite`,
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        data:body
    }
    try{
        const response = await axios.request(options)
        return response.data
    }catch(error){
        if (!navigator.onLine || error.code === 'ERR_NETWORK') {
            saveOffline(options)
        }
        throw error
    } 
    
}

const saveOffline=(options)=>{
    let db=window.indexedDB.open('database');
    db.onsuccess=event=>{
        let result=event.target.result;
        let transaccion=result.transaction('table', 'readwrite');
        let obj=transaccion.objectStore('table');
        const resultado=obj.add(options);
        resultado.onsuccess=event2=>{
            console.log("saved offline", event2.target.result);
        }
    }
}