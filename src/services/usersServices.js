
import axios from "axios";

const SERVER_URL = 'http://localhost:9393';


// @desc 'GET' all users
// @route 'http://localhost:9393/users'
export const getUsersServer = async () => {
   const url = `${SERVER_URL}/users`;
   return axios.get(url);
};

// @desc 'GET' user by userId
// @route 'http://localhost:9393/users/:userId'
export const getUserServer = async (userId) => {
   const url = `${SERVER_URL}/users/${userId}`;
   return axios.get(url);
};

// @desc 'POST' New User
// @route 'http://localhost:9393/users'
export const addUserServer = async (user) => {
   const url = `${SERVER_URL}/users`;
   return axios.post(url, user);
};

// @desc 'DELETE' User by userId
// @route 'http://localhost:9393/users/:userId'
export const deleteUserServer = async (userId) => {
   const url = `${SERVER_URL}/users/${userId}`;
   return axios.delete(url);
};