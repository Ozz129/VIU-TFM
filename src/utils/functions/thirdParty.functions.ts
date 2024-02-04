import axios from "axios";

export default {
    async checkWeatherApi(city: string = 'Popayán') {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
                params: {
                    q: city,
                    key: '983e5d27694145f99a3235320241801'
                }
            });
    
            return response.data;
            // Aquí puedes hacer algo con los datos del clima
        } catch (err) {
            console.error('Error al obtener datos del clima:', err);
        }
    },
    sendEmail() {

    }
}