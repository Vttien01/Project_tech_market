import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useEffect, useState } from 'react';
import useAuth from '@hooks/useAuth';
import useTranslate from '@hooks/useTranslate';
import useFetch from '@hooks/useFetch';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Modal, Spin } from 'antd';
import { defineMessages } from 'react-intl';
import Chart from 'chart.js/auto';

const accountLevels = [
    { name: 'Mới', min: 0, max: 1000000 },
    { name: 'Bạc', min: 1000000, max: 5000000 },
    { name: 'Vàng', min: 5000000, max: 20000000 },
    { name: 'Kim cương', min: 20000000, max: 40000000 },
    { name: 'VIP', min: 40000000, max: Infinity },
];

const dataDemo1 = [
    { createdDate: '02/12/2024', totalMoney: 500000 },
    { createdDate: '05/12/2024', totalMoney: 700000 },
    { createdDate: '10/12/2024', totalMoney: 15000000 },
    { createdDate: '15/12/2024', totalMoney: 10000000 },
    { createdDate: '20/12/2024', totalMoney: 20000000 },
];

const messages = defineMessages({
    objectName: 'Tiến trình tăng trưởng của người dùng',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});

const ModalChart = ({ open, onCancel, dataHistoryOrder, itemUser, ...props }) => {
    const translate = useTranslate();
    const { isAdmin } = useAuth();
    const [chartData, setChartData] = useState([]);

    const accountCreatedDate = dayjs(itemUser?.createdDate, 'DD/MM/YYYY');
    useEffect(() => {
        if (dataHistoryOrder?.length > 0) {
            let totalSpent = 0;
            const chartData1 = dataHistoryOrder.map((order) => {
                totalSpent += order.totalMoney;
                return {
                    date: dayjs(order.createdDate, 'DD/MM/YYYY').format('DD/MM'),
                    totalSpent,
                    daysSinceOrder: dayjs(order.createdDate, 'DD/MM/YYYY').diff(accountCreatedDate, 'day'),
                };
            });
            setChartData(chartData1);
        }
    }, [dataHistoryOrder]);

    // Tính tổng chi tiêu tích lũy qua từng đơn hàng

    // Tạo dữ liệu cho biểu đồ
    const data = {
        labels: chartData.map((item) => item.date), // Danh sách ngày
        datasets: [
            {
                label: 'Tổng chi tiêu (VND)',
                data: chartData.map((item) => item.totalSpent), // Tổng chi tiêu tương ứng
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4, // Làm đường biểu đồ cong mượt hơn
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            // title: {
            //     display: true,
            //     text: 'Tiến trình tăng trưởng tài khoản',
            // },
            tooltip: {
                callbacks: {
                    // Tùy chỉnh tooltip để hiển thị số ngày
                    label: function (context) {
                        const dataIndex = context.dataIndex;
                        const item = chartData[dataIndex];
                        return [
                            `Tổng chi tiêu: ${item.totalSpent.toLocaleString()} VND`,
                            `Số ngày từ khi tạo: ${item.daysSinceOrder} ngày`,
                        ];
                    },
                },
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
        <Modal
            title={translate.formatMessage(messages.objectName)}
            {...props}
            centered
            open={open}
            maskClosable={false}
            onCancel={onCancel}
            footer={null}
            width={'max-content'}
        >
            <div style={{ width: '60vw', maxWidth: '80vw', margin: '0 auto' }}>
                {/* <h2>Tiến trình tăng trưởng thành viên</h2> */}
                {dataHistoryOrder ? <Line data={data} options={options} /> : <Spin />}
            </div>
        </Modal>
    );
};

export default ModalChart;
