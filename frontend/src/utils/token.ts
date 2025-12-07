export const getUserToken = async () => {
  const userData = await window.electronAPI.getUserData();
  if (!userData || !userData.token) {
    throw new Error("User token not found");
  }
  return userData.token;
};