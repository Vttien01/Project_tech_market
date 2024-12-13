import apiConfig from '@constants/apiConfig';
import VoucherListPage from '.';
import VoucherSavePage from './VoucherSavePage';
export default {
    voucherListPage: {
        path: '/voucher',
        title: 'Voucher List Page',
        auth: true,
        component: VoucherListPage,
        permissions: [apiConfig.voucher.getList.baseURL],
    },
    voucherSavePage: {
        path: '/voucher/:id',
        title: 'Voucher Save Page',
        auth: true,
        component: VoucherSavePage,
        permissions: [apiConfig.voucher.create.baseURL, apiConfig.voucher.update.baseURL],
    },
};
