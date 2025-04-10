
import axios, { AxiosResponse } from "axios";
import { type UserReactions, type User } from "../features/users/usersSlice";

const SERVER_URL = 'http://localhost:9393';


// @desc 'GET' all users
// @route 'http://localhost:9393/users'
export const getUsersServer = async () => {
   const url = `${SERVER_URL}/users`;
   return axios.get<User[]>(url);
};

// @desc 'GET' user by userId
// @route 'http://localhost:9393/users/:userId'
export const getUserServer = async (userId: string) => {
   const url = `${SERVER_URL}/users/${userId}`;
   return axios.get<User>(url);
};

// @desc 'POST' New User
// @route 'http://localhost:9393/users'
export const addUserServer = async (user: User) => {
   const url = `${SERVER_URL}/users`;
   return axios.post(url, user);
};

// @desc 'DELETE' User by userId
// @route 'http://localhost:9393/users/:userId'
export const deleteUserServer = async (userId: string) => {
   const url = `${SERVER_URL}/users/${userId}`;
   return axios.delete(url);
};

// @desc 'PATCH' User.reactions by userId
// @route 'http://localhost:9393/users/:userId'
export const addUserReactionServer = async (newUserData: Pick<User, 'id' | 'reactions'>) => {
   const { id: userId } = newUserData;
   const url = `${SERVER_URL}/users/${userId}`;
   return axios.patch(url, newUserData);
};