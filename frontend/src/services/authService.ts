import { makeApiRequest } from "@/utils/apiRequest";

export const loginUser = async(email: String, password: String)=>{
    const response = await makeApiRequest("post",'/auth/login', {email, password}, true)
    return response?.data
}

export const getUserToken = async (): Promise<string | null> => {
  try {
    const userData = await window.electronAPI.getUserData();
    return userData?.token || null;
  } catch {
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await window.electronAPI.deleteUserData();
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};
