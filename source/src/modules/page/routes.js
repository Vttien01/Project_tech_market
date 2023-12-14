import apiConfig from '@constants/apiConfig';
import ProductHomePage from './ProductHome';
import IntroductionHomePage from './IntroductionHome';
import ContactHome from './ContactHome';
import ExperienceHome from './ExperienceHome';
import HomePage from './HomePage';
export default {
    ProductHomePage1: {
        path: '/all-product',
        component: ProductHomePage,
        auth: null,
        title: 'Tất cả sản phẩm',
    },
    IntroductionHome: {
        path: '/introduction',
        component: IntroductionHomePage,
        auth: null,
        title: 'Giới thiệu trang web',
    },
    ContactHome: {
        path: '/contact',
        component: ContactHome,
        auth: null,
        title: 'Liên hệ với chúng tôi',
    },
    ExperienceHome: {
        path: '/experience',
        component: ExperienceHome,
        auth: null,
        title: 'Kinh nghiệm hay',
    },
    ProductOfCategory: {
        path: '/all-product/:categoryId',
        component: ProductHomePage,
        auth: null,
        title: 'Điện thoại thông minh',
    },
    HomePage: {
        path: '/home',
        component: HomePage,
        auth: null,
        title: 'Trang chủ',
    },
};
