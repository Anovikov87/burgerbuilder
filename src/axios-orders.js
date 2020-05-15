import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-my-burger-ded23.firebaseio.com/'
})

export default instance