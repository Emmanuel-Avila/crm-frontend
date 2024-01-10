import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from "../views/Login.vue";
import { getUserData, isUserLoggedIn, getHomeRouteForLoggedInUser } from '../helper/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        redirectIfLoggedIn: true,
      }
    },
    {
      path: '/blog',
      name: 'blog',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Blog.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/productos',
      name: 'products',
      component: () => import('../views/Products.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/nosotros',
      name: 'us',
      component: () => import('../views/Us.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/landing',
      name: 'landing',
      component: () => import('../views/LandingImages.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/campanas-salud',
      name: 'health-campaign',
      component: () => import('../views/HealthCampaign.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/prevision-social',
      name: 'social-prevision',
      component: () => import('../views/SocialPrevision.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/capacitaciones',
      name: 'training',
      component: () => import('../views/Training.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/eventos',
      name: 'events',
      component: () => import('../views/Events.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/servicios-digitales',
      name: 'digital-services',
      component: () => import('../views/DigitalServices.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/cuentas-recaudo',
      name: 'accounts',
      component: () => import('../views/Accounts.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/descuentos',
      name: 'discounts',
      component: () => import('../views/Discounts.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/convenios-comerciales',
      name: 'covenants',
      component: () => import('../views/Covenant.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/feria',
      name: 'fair',
      component: () => import('../views/Fair.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/transparencia',
      name: 'transparency',
      component: () => import('../views/Transparency.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/elecciones',
      name: 'elections',
      component: () => import('../views/Elections.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/oficinas',
      name: 'offices',
      component: () => import('../views/Offices.vue'),
      meta: {
        requiresCRM: true,
      }
    },
    {
      path: '/lista-quejas',
      name: 'complaints',
      component: () => import('../views/ComplaintsTable.vue'),
      meta: {
        requiresCOMP: true,
      }
    },
    {
      path: '/queja/:id',
      name: 'complaint-detail',
      component: () => import('../views/ComplaintDetail.vue'),
      meta: {
        requiresCOMP: true,
      }
    },
    {
      path: '/editar-respuestas',
      name: 'edit-responses',
      component: () => import('../views/EditResponses.vue'),
      meta: {
        requiresCOMP: true,
      }
    },
    {
      path: '/editar-usuario',
      name: 'edit-user',
      component: () => import('../views/EditUser.vue'),
      meta: {
        requiresCOMP: true,
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  const isLogged = isUserLoggedIn();

  if (to.meta.redirectIfLoggedIn && isLogged) {
    const userData = getUserData();
    console.log(userData)
    next(getHomeRouteForLoggedInUser(userData));
  }

  if (to.meta.requiresCRM) {
    const userData = getUserData();
    if (userData === null || userData.type !== "CRM") return next("/login");
  }

  if (to.meta.requiresCOMP) {
    const userData = getUserData();
    if (userData === null || userData.type !== "COMP") return next("/login");
  }

  return next();
})
export default router
