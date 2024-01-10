export const isUserLoggedIn = () => {
  return (
    localStorage.getItem("user") &&
    localStorage.getItem("token")
  );
};

export const getUserData = () => {
  if (!localStorage.getItem("user") || localStorage.getItem("user").trim() === "") {
    return null
  }
  return JSON.parse(localStorage.getItem("user"))
}

export const getHomeRouteForLoggedInUser = (user) => {
  if (user !== null && user.type === "CRM") return { name: "blog" };
  if (user !== null && user.type === "COMP") return { name: "complaints" };
  return { name: "home" };
};
