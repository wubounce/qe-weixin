import { asyncRoutes, constantRoutes } from '@/router/routers'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
    let goldManage = roles.includes('金币管理');
    let goldUser = roles.includes('金币会员');
    if ((route.meta && route.meta.title == '金币管理' && !goldManage) || (route.meta && route.meta.title == '金币会员' && !goldUser)) {
        return false;
    } else {
        return true;
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            res.push(tmp)
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
        }
    })
    return res
}


const permission = {
    state: {
        routes: [],
        addRoutes: []
    },

    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        }
    },

    actions: {
        generateRoutes ({ commit }, menu) {
            return new Promise(resolve => {
                let roles = menu.map(i => i.name);
                let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                commit('SET_ROUTES', constantRoutes.concat(accessedRoutes))
                resolve(accessedRoutes)
            })
        }
    }
};

export default permission;
