export default defineNuxtRouteMiddleware(async () => {
  if (!authen().loggedIn) {
    abortNavigation();
    return navigateTo(useLocalePath()({ name: "login" }));
  } else {
    apiRefs().initializeBack();
  }
});
