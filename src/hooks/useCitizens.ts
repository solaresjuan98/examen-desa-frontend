import axios from "../axios/axios";


export const useCitizens = () => {

    const getCitizens = async () => {
        try {
            const { data } = await axios.get('/citizens');
            return data;
        } catch (error) {
            console.error('Error al obtener los ciudadanos:', error);
        }
    }

    return {
        getCitizens
    }
}
