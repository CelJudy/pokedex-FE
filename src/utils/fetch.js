import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/'

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
        throw error
    }
}