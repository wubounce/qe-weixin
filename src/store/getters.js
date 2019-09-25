const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  size: state => state.app.size,
  token: state => state.user.token,
  access: state => state.user.access,
  permission_routes: state => state.permission.routes,
};
export default getters;
