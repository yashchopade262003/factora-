import api from "../api/axios";

const getDashboardData = () => {

    return api.get("/dashboard");

};

export default {

    getDashboardData

};