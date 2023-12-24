import {
    STATUS_ACTIVE,
    STATUS_INACTIVE,
    STATUS_PENDING,
    PROVINCE_KIND,
    DISTRICT_KIND,
    VILLAGE_KIND,
    PAYPAL_METHOD,
    COD_METHOD,
    STATE_PENDING,
    STATE_CONFIRMED,
    STATE_COMPLETED,
    STATE_CANCELED,
    STATE_NOPAID,
    STATE_PAIDED,
} from '@constants';
import { defineMessages } from 'react-intl';
import { nationKindMessage } from './intl';

const commonMessage = defineMessages({
    statusActive: 'Active',
    statusPending: 'Pending',
    statusInactive: 'Inactive',
});

const paymentMessage = defineMessages({
    PAYPAL_METHOD: 'PayPal',
    COD_METHOD: 'Tiền mặt',
});

const orderStateMessage = defineMessages({
    STATE_PENDING: 'Đang xử lý',
    STATE_CONFIRMED: 'Đang vận chuyển',
    STATE_COMPLETED: 'Đã hoàn thành',
    STATE_CANCELED: 'Đã hủy',

});

const isPaidMessage = defineMessages({
    STATE_NOPAID: 'Chưa thanh toán',
    STATE_PAIDEDD: 'Đã thanh toán',
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Active', color: 'green' },
    { value: STATUS_PENDING, label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE, label: 'Inactive', color: 'red' },
];

export const orderStateOption = [
    { value: STATE_PENDING, label: orderStateMessage.STATE_PENDING, color: '#d4d61d' },
    { value: STATE_CONFIRMED, label: orderStateMessage.STATE_CONFIRMED, color: '#46c956' },
    { value: STATE_COMPLETED, label: orderStateMessage.STATE_COMPLETED, color: '#9af099' },
    { value: STATE_CANCELED, label: orderStateMessage.STATE_CANCELED, color: '#f52828' },
];

export const paidOptions = [
    { value: STATE_NOPAID, label: isPaidMessage.STATE_NOPAID },
    { value: STATE_PAIDED, label: isPaidMessage.STATE_PAIDEDD },
];

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const paymentOptions = [
    { value: COD_METHOD, label: paymentMessage.COD_METHOD, color: '#00A648' },
    { value: PAYPAL_METHOD, label: paymentMessage.PAYPAL_METHOD, color: '#FFBF00' },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const nationKindOptions = [
    {
        value: PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: VILLAGE_KIND,
        label: nationKindMessage.village,
    },
];
