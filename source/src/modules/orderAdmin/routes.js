import apiConfig from '@constants/apiConfig';
import BrandListPage from '.';
import BrandSavePage from './OrderAdminSavePage';
import OrderAdminPage from '.';
import OrderAdminSavePage from './OrderAdminSavePage';
import DetailOrder from './DetailOrder';
export default {
    OrderPageAdmin: {
        path: '/order-admin',
        component: OrderAdminPage,
        auth: true,
        title: 'Quản lý đơn hàng',
    },
    DetailOrderAdmin: {
        path: '/order-admin/detai-order',
        component: DetailOrder,
        auth: true,
        title: 'Quản lý chi tiết đơn hàng',
    },
    OrderPageAdminSavePage: {
        path: '/order-admin/:id',
        component: OrderAdminSavePage,
        auth: true,
        title: 'Oder Admin Save Page',
        permissions: [apiConfig.order.create.baseURL, apiConfig.order.update.baseURL],
    },
};
