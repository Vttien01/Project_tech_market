import PageNotFound from '@components/common/page/PageNotFound';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import LoginPage from '@modules/login/index';
import Dashboard from '@modules/entry';
import ProfilePage from '@modules/profile/index';
import adminsRoutes from '@modules/user/routes';
import newsRoutes from '@modules/news/routes';
import nationRoutes from '@modules/nation/routes';
import GroupPermissionListPage from '@modules/groupPermission';
import PermissionSavePage from '@modules/groupPermission/PermissionSavePage';
import SettingListPage from '@modules/listSetting';
import SettingSavePage from '@modules/listSetting/SettingSavePage';
import ProductHomePageRoutes from '@modules/page/routes';
import BrandRoutes from '@modules/brand/routes';
import ProductRoutes from '@modules/product/routes';
import SignupPage from '@modules/signup';
import ProfileForm from '@modules/profileUser/ProfileForm';
import ProfileUserPage from '@modules/profileUser';
import PersonInfo from '@modules/profileUser/PersonInfo';
import OrderAdmin from '@modules/orderAdmin/routes';


/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    settingPage: {
        path: '/setting',
        component: Dashboard,
        auth: true,
        title: 'Setting',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    signupPage: {
        path: '/signup',
        component: SignupPage,
        auth: false,
        title: 'Signup page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    profilePageUser: {
        path: '/profile-user',
        component: PersonInfo,
        auth: null,
        title: 'Profile User page',
    },
    groupPermissionPage: {
        path: '/group-permission',
        component: GroupPermissionListPage,
        auth: true,
        title: 'Profile page',
    },
    groupPermissionSavePage: {
        path: '/group-permission/:id',
        component: PermissionSavePage,
        auth: true,
        title: 'Profile page',
    },
    listSettingsPage:{
        path:'/settings',
        component:SettingListPage,
        auth: true,
        title: 'Settings page',
    },
    listSettingsPageSavePage: {
        path: '/settings/:id',
        component: SettingSavePage,
        auth: true,
        title: 'Settings page',
    },
    ...adminsRoutes,
    ...newsRoutes,
    ...nationRoutes,
    ...ProductHomePageRoutes,
    ...BrandRoutes,
    ...ProductRoutes,
    ...OrderAdmin,


    // keep this at last
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
