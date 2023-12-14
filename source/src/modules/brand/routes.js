import apiConfig from '@constants/apiConfig';
import BrandListPage from '.';
import BrandSavePage from './BrandSavePage';
export default {
    brandListPage: {
        path: '/brand',
        title: 'Brand List Page',
        auth: true,
        component: BrandListPage,
    },
    brandSavePage: {
        path: '/brand/:id',
        title: 'Brand Save Page',
        auth: true,
        component: BrandSavePage,
        // permissions: [apiConfig.brand.create.baseURL, apiConfig.brandSavePage.update.baseURL],
    },
};
