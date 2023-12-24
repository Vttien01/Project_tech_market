import React from 'react';
import {
    DollarCircleOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserOutlined,
    UngroupOutlined,
    RiseOutlined,
    FallOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Card, DatePicker, Space, Statistic, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getCustomers, getInventory, getOrders, getRevenue } from '../API/index';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { formatMoney } from '@utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [orders, setOrders] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [customers, setCustomers] = useState(0);
    const [revenue, setRevenue] = useState(0);

    const { data: dataOrder, execute: executeOrder } = useFetch({
        ...apiConfig.order.getList,
    });

    const { data: dataUser, execute: executeUser } = useFetch({
        ...apiConfig.user.getList,
    });

    const { data: dataProduct, execute: executeProduct } = useFetch({
        ...apiConfig.product.getList,
    });

    const { data: dataRevenue, execute: executeRevenue } = useFetch({
        ...apiConfig.revenue.getRevenue,
    });

    useEffect(() => {
        executeOrder({
            onCompleted: (response) => {
                setOrders(response.data?.totalElements);
            },
        });
        executeProduct({
            onCompleted: (response) => {
                setRevenue(response.data?.totalElements);
            },
        });
        executeUser({
            onCompleted: (response) => {
                setCustomers(response.data?.totalElements);
            },
        });
        executeRevenue({
            onCompleted: (response) => {
                setInventory(response.data?.revenue);
            },
        });
        // setOrders(dataOrder?.data?.totalElements);
        // setRevenue(dataProduct?.data?.totalElements);
        // setCustomers(dataUser?.data?.totalElements);
    }, []);

    return (
        <Space size={20} direction="vertical">
            <Typography.Title level={4}>Thông số</Typography.Title>
            <Space direction="vertical">
                <Space direction="horizontal">
                    <DashboardCard
                        icon={
                            <ShoppingCartOutlined
                                style={{
                                    // color: 'green',
                                    // backgroundColor: 'rgba(0,255,0,0.25)',
                                    backgroundColor: 'rgba(255,0,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        icon1={
                            <RiseOutlined
                                style={{
                                    color: 'red',
                                    fontSize: 20,
                                    paddingRight: 4,
                                }}
                            />
                        }
                        title={'Đơn hàng'}
                        value={orders}
                        number="18"
                    />
                    <DashboardCard
                        icon={
                            <UserOutlined
                                style={{
                                    // color: 'purple',
                                    // backgroundColor: 'rgba(0,255,255,0.25)',
                                    backgroundColor: 'rgba(255,0,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        icon1={
                            <RiseOutlined
                                style={{
                                    color: 'red',
                                    fontSize: 20,
                                    paddingRight: 4,
                                }}
                            />
                        }
                        title={'Khách hàng'}
                        value={customers}
                        number="11"
                    />
                </Space>
                <Space direction="horizontal">
                    <DashboardCard
                        icon={
                            // <DollarCircleOutlined
                            <UngroupOutlined
                                style={{
                                    // color: 'blue',
                                    // backgroundColor: 'rgba(0,0,255,0.25)',
                                    backgroundColor: 'rgba(255,0,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        icon1={
                            <RiseOutlined
                                style={{
                                    color: 'red',
                                    fontSize: 20,
                                    paddingRight: 4,
                                }}
                            />
                        }
                        title={'Sản phẩm'}
                        value={revenue}
                        number="14"
                    />
                    <DashboardCard
                        icon={
                            <DollarCircleOutlined
                                style={{
                                    // color: 'red',
                                    backgroundColor: 'rgba(255,0,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        icon1={
                            <RiseOutlined
                                style={{
                                    color: 'red',
                                    fontSize: 20,
                                    paddingRight: 4,
                                }}
                            />
                        }
                        number="12"
                        title={'Doanh thu'}
                        value={formatMoney(inventory, {
                            groupSeparator: ',',
                            decimalSeparator: '.',
                            currentcy: 'đ',
                            currentcyPosition: 'BACK',
                            currentDecimal: '0',
                        })}
                    />
                </Space>
            </Space>
            <Space>
                <RecentOrders />
                <DashboardChart />
            </Space>
        </Space>
    );
}

function DashboardCard({ title, value, icon, icon1, number }) {
    return (
        <Card style={{ width: 500 }}>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space direction="horizontal">
                    {icon}
                    <Statistic title={title} value={value} />
                </Space>
                <div
                    style={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#bbf7d1',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'red',
                        fontSize: 19,
                        fontWeight: 600,
                    }}
                >
                    {icon1}
                    {number}%
                </div>
            </Space>
        </Card>
    );
}
function RecentOrders() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data: dataOrder, execute: executeOrder } = useFetch({
        ...apiConfig.order.getList,
    });

    useEffect(() => {
        setLoading(true);
        executeOrder({
            onCompleted: (response) => {
                const num = response.data.totalElements;
                setDataSource(response.data.content.slice(-3));
                setLoading(false);
                console.log(response.data.content.slice(-3));
            },
        });
        // getOrders().then((res) => {
        //     setDataSource(res.products.splice(0, 3));
        //     setLoading(false);
        // });
    }, []);

    return (
        <>
            <Typography.Title level={4}>Đơn hàng gần đây</Typography.Title>
            <Table
                columns={[
                    {
                        title: 'Mã đơn hàng',
                        dataIndex: 'orderCode',
                        align:'center',
                    },
                    {
                        title: 'Số điện thoại',
                        dataIndex: 'phone',
                        align:'center',
                    },
                    {
                        title: 'Tổng tiền',
                        dataIndex: 'totalMoney',
                        align:'center',
                        render: (value) => {
                            return (
                                <span>
                                    {formatMoney(value, {
                                        groupSeparator: ',',
                                        decimalSeparator: '.',
                                        currentcy: 'đ',
                                        currentcyPosition: 'BACK',
                                        currentDecimal: '0',
                                    })}
                                </span>
                            );
                        },
                    },
                ]}
                loading={loading}
                dataSource={dataSource}
                pagination={false}
                style={{ width:400 }}
            ></Table>
        </>
    );
}

function DashboardChart() {
    const [reveneuData, setReveneuData] = useState({
        labels: [],
        datasets: [],
    });
    const [year, setYear] = useState('2023');

    const { data: dataRevenue, execute: executeRevenue } = useFetch({
        ...apiConfig.revenue.getRevenueMonth,
    });

    useEffect(() => {
        executeRevenue({
            params: { year: year },
            onCompleted: (response) => {

                const labels = response.data.map((cart) => {
                    return `Tháng ${cart.month}`;
                });
                const data = response.data.map((cart) => {
                    return cart.revenue;
                });

                const dataSource = {
                    labels,
                    datasets: [
                        {
                            label: 'Thống kê doanh thu từng tháng',
                            data: data,
                            backgroundColor: 'rgba(255, 0, 0, 1)',
                        },
                    ],
                };

                setReveneuData(dataSource);
            },
        });
    }, [year]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Doanh thu đơn hàng',
            },
        },
    };
    const onChange = (date, dateString) => {
        setYear(date.$y);
    };
    return (
        <Card style={{ width: 550, height: 350, marginTop: 15 }}>
            <DatePicker onChange={onChange} picker="year" />
            <Bar options={options} data={reveneuData} style={{ minWidth: 500 }} />
        </Card>
    );
}
export default Dashboard;
