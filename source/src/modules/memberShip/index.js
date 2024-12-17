import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useAuth from '@hooks/useAuth';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useFetch from '@hooks/useFetch';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import Chart from 'chart.js/auto';
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const accountLevels = [
    { name: 'Mới', min: 0, max: 1000000 },
    { name: 'Bạc', min: 1000000, max: 5000000 },
    { name: 'Vàng', min: 5000000, max: 20000000 },
    { name: 'Kim cương', min: 20000000, max: 40000000 },
    { name: 'VIP', min: 40000000, max: Infinity },
];

const orderHistory = [
    { orderId: 2, amount: 700000 },
    { orderId: 1, amount: 500000 },
    { orderId: 3, amount: 15000000 },
    { orderId: 4, amount: 10000000 },
];
const totalSpent = orderHistory.reduce((sum, order) => sum + order.amount, 0);
const dataDemo1 = [
    { createdDate: '02/12/2024', totalMoney: 500000 },
    { createdDate: '03/12/2024', totalMoney: 700000 },
    { createdDate: '04/12/2024', totalMoney: 15000000 },
    { createdDate: '05/12/2024', totalMoney: 10000000 },
    { createdDate: '06/12/2024', totalMoney: 20000000 },
    { createdDate: '07/12/2024', totalMoney: 500000 },
    { createdDate: '08/12/2024', totalMoney: 700000 },
    { createdDate: '07/12/2024', totalMoney: 500000 },
    { createdDate: '08/12/2024', totalMoney: 700000 },
    { createdDate: '09/12/2024', totalMoney: 15000000 },
    { createdDate: '10/12/2024', totalMoney: 10000000 },
    { createdDate: '11/12/2024', totalMoney: 20000000 },
    { createdDate: '12/12/2024', totalMoney: 15000000 },
    { createdDate: '13/12/2024', totalMoney: 15000000 },
    { createdDate: '14/12/2024', totalMoney: 10000000 },
    { createdDate: '15/12/2024', totalMoney: 20000000 },
    { createdDate: '16/12/2024', totalMoney: 10000000 },
    { createdDate: '20/12/2024', totalMoney: 20000000 },
];

const MemberShipListPage = ({ pageOptions, createdAccountDate = '01/12/2024' }) => {
    const translate = useTranslate();
    const { isAdmin } = useAuth();
    const { data: orderGetList } = useFetch(apiConfig.order.getList, {
        immediate: true,
        mappingData: ({ data }) => data.content,
        params: {
            state: 4,
            userId: 6894472451588096,
        },
    });
    const accountCreatedDate = dayjs(createdAccountDate, 'DD/MM/YYYY');

    let totalSpent = 0;
    const chartData = orderGetList.map((order) => {
        totalSpent += order.totalMoney;
        return {
            date: dayjs(order.createdDate, 'DD/MM/YYYY').format('DD/MM'),
            totalSpent,
        };
    });

    const data = {
        labels: chartData.map((item) => item.date),
        datasets: [
            {
                label: 'Tổng chi tiêu (VND)',
                data: chartData.map((item) => item.totalSpent),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tiến trình tăng trưởng tài khoản',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Tổng chi tiêu (VND)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Ngày',
                },
            },
        },
    };

    return (
        // <div style={{ width: '600px', margin: '0 auto' }}>
        //     <Bar data={data} options={options} />
        // </div>
        <div style={{ width: '800px', margin: '0 auto' }}>
            <h2>Tiến trình tăng trưởng thành viên</h2>
            <Line data={data} options={options} />
        </div>
    );
};

const dataDemo = [
    {
        id: 8034890025435136,
        modifiedDate: '17/12/2024 13:37:15',
        createdDate: '16/12/2024 02:43:14',
        province: 'Thành Phố Hồ Chí Minh',
        ward: 'Xã nghĩa Hòa',
        district: 'Quận 1',
        phone: '0123456789',
        address: '143/35 nguyenvana',
        paymentMethod: 0,
        receiver: 'Nguyen Van A',
        totalMoney: 24990000,
        userId: 6894472451588096,
        isPaid: true,
        expectedDeliveryDate: '17/12/2024 00:00:00',
        state: 4,
        orderCode: '1GZA12M',
    },
    {
        id: 8031073555808256,
        modifiedDate: '15/12/2024 04:42:03',
        createdDate: '14/12/2024 18:22:05',
        province: 'Thành Phố Hồ Chí Minh',
        ward: 'Xã nghĩa Hòa',
        district: 'Quận 2',
        phone: '0937749536',
        address: '41 Nguyễn Bá Loan',
        paymentMethod: 2,
        receiver: 'Quangthoi2',
        totalMoney: 23754100,
        userId: 6894472451588096,
        isPaid: true,
        expectedDeliveryDate: '25/12/2024 00:00:00',
        state: 4,
        orderCode: '596RMU3',
    },
    {
        id: 8029504978714624,
        modifiedDate: '17/12/2024 13:02:21',
        createdDate: '14/12/2024 05:04:16',
        province: 'Thành Phố Hồ Chí Minh',
        ward: 'Xã nghĩa Hòa',
        district: 'Quận 2',
        phone: '0937749536',
        address: '41 Nguyễn Bá Loan',
        paymentMethod: 1,
        receiver: 'Quangthoi3',
        totalMoney: 49980000,
        userId: 6894472451588096,
        isPaid: true,
        expectedDeliveryDate: '17/12/2024 00:00:00',
        state: 4,
        orderCode: 'DT1PGSN',
    },
    {
        id: 8028898147237888,
        modifiedDate: '14/12/2024 01:12:18',
        createdDate: '13/12/2024 23:55:37',
        province: 'Thành Phố Quảng Ngãi',
        ward: 'Xã nghĩa Điền',
        district: 'Huyện tư Nghĩa',
        phone: '0966355021',
        address: 'hiện ở Quảng Ngãi',
        paymentMethod: 0,
        receiver: 'Trần Quang Sơn 1',
        totalMoney: 23576100,
        userId: 6894472451588096,
        isPaid: true,
        state: 4,
        orderCode: 'W1UX2PL',
    },
];

export default MemberShipListPage;
