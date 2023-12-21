import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Space, Image, Input, ConfigProvider, Badge, Form, Checkbox, Typography, Button, Drawer, InputNumber, Table, message } from 'antd';
import {
    DownOutlined,
    UserOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
    ShoppingCartOutlined,
    ToolOutlined,
} from '@ant-design/icons';
const { Header } = Layout;

import styles from './AppHeader.module.scss';
import useAuth from '@hooks/useAuth';
import { useDispatch } from 'react-redux';
import { accountActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { removeCacheToken } from '@services/userService';
import { generatePath, useNavigate } from 'react-router-dom';
import { AppConstants } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import logo from '@assets/images/logoTech.png';
import routes from '@routes';
import { formatMoney } from '@utils';
const { Search } = Input;

const messages = defineMessages({
    profile: 'Profile',
    logout: 'Logout',
    Admin: 'Admin',
});

const AppHeader = ({ collapsed, onCollapse }) => {
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const translate = useTranslate();
    const { execute: executeLogout } = useFetch(apiConfig.account.logout);

    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
        // navigate(routes.ProductHomePage1.path);
    };

    // const { execute, data } = useFetch({
    //     ...apiConfig.cart.getList,
    // });
    const {
        data,
        // loading: getcompanyLoading,
        execute: executesbrands,
    } = useFetch(apiConfig.cart.getList, {
        immediate: true,
        // mappingData: ({ data }) =>
        //     data.content.map((item) => ({
        //         value: item.id,
        //         label: item.name,
        //     })),
    });


    const itemCart = data ? data : [];

    const itemHeader = () => {
        const items = [
            {
                // icon: <ShoppingCartOutlined style={{ fontSize: 22 }} />,
                icon: (
                    <AppCart />
                ),
                key: 'cart',
            },
        ];
        if (profile) {
            items.push({
                key: 'menu',
                label: (
                    <Space>
                        <Avatar
                            icon={<UserOutlined />}
                            src={`${AppConstants.contentRootUrl}${profile.logoPath || profile.avatar || profile.logo}`}
                        />
                        {profile?.careerName || profile?.leaderName || profile?.fullName || profile?.companyName}
                        <DownOutlined />
                    </Space>
                ),
                children: [
                    {
                        label: (
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <UserOutlined />
                                <span>{translate.formatMessage(messages.profile)}</span>
                            </div>
                        ),
                        key: 'profile',
                        onClick: () => navigate('/profile'),
                    },
                    profile?.accountDto?.kind === 2 && {
                        label: (
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <ToolOutlined />
                                <span>{translate.formatMessage(messages.Admin)}</span>
                            </div>
                        ),
                        key: 'admin',
                        onClick: () => navigate('/student'),
                    },
                    {
                        label: (
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <LoginOutlined />
                                <span>{translate.formatMessage(messages.logout)}</span>
                            </div>
                        ),
                        key: 'logout',
                        onClick: onLogout,
                    },
                ],
            });
        } else {
            items.push({
                key: 'Log_in',
                label: <span>Đăng nhập/Đăng ký</span>,
                onClick: () => navigate(routes.loginPage.path),
            });
        }
        return items;
    };

    return (
        <Layout>
            <Header className={styles.appHeader} style={{ padding: 0, background: 'white', height: 90 }}>
                <a href="" title="Tech-Market" rel="home" style={{ marginLeft: 100, marginTop: 35 }}>
                    <img width="200" height="60" src={logo} alt="Tech-market" />
                </a>
                {/* <Input.Search
                    placeholder="Bạn muốn tìm gì?"
                    size="500"
                    style={{ fontSize:5, marginTop: 15, width: 400, alignItems: 'center', marginLeft: 150 }}
                /> */}

                <Menu mode="horizontal" className={styles.rightMenu} selectedKeys={[]} items={itemHeader()} />
            </Header>
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: '#f57e20',
                        // borderRadius: 2,

                        // Alias Token
                        // colorBgContainer: '#f57e20',
                    },
                }}
            >
                <Header className={styles.appHeader2} style={{ paddingLeft: 100, borderBottom: '1px solid #f57e20' }}>
                    <div className={styles.div_Category}>
                        <UnorderedListOutlined />
                        DANH MỤC SẢN PHẨM
                    </div>
                    <Menu
                        mode="horizontal"
                        className={styles.menu2}
                        selectedKeys={[]}
                        style={{ width: '10px' }}
                        items={[
                            {
                                label: <span className={styles.label}>TRANG CHỦ</span>,
                                key: `Home`,
                                onClick: () => navigate(routes.HomePage.path),
                            },
                            {
                                label: <span className={styles.label}>GIỚI THIỆU</span>,
                                key: `introduce`,
                                onClick: () => navigate(routes.IntroductionHome.path),
                            },
                            {
                                label: <span className={styles.label}>SẢN PHẨM</span>,
                                key: `product`,
                                onClick: () => navigate(routes.ProductHomePage1.path),
                            },
                            {
                                label: <span className={styles.label}>KINH NGHIỆM HAY</span>,
                                key: `experience`,
                                onClick: () => navigate(routes.ExperienceHome.path),
                            },
                            {
                                label: <span className={styles.label}>LIÊN HỆ</span>,
                                key: `contact`,
                                onClick: () => navigate(routes.ContactHome.path),
                            },
                        ]}
                    />
                </Header>
            </ConfigProvider>
        </Layout>
    );
};

function AppCart() {
    const [CartDrawer, setCartDrawer] = useState(false);
    const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
    const [cartItem, setCartItem] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);


    // useEffect(() => {
    //     getCart().then((res) => {
    //         setCartItem(res.products);
    //     });
    // }, []);
    useEffect(() => {
        // Lấy giỏ hàng từ localStorage khi component được render
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log(storedCart);
        setCartItem(storedCart);
        calculateTotal(storedCart);
    }, []);
    const calculateTotal = (cartItems) => {
        const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };
    function onConfirmOrder(values) {
        setCheckoutDrawerOpen(false);
        message.success('Đặt hàng thành công');
    }
    return (
        <div>
            <Badge
                onClick={() => {
                    setCartDrawer(true);
                }}
                count={cartItem.length}
                className="ShopingCartIcon"
            >
                <ShoppingCartOutlined style={{ fontSize: 20 }} />
            </Badge>
            <Drawer
                open={CartDrawer}
                onClose={() => {
                    setCartDrawer(false);
                }}
                title="Giỏ hàng"
                contentWrapperStyle={{ width: 600 }}
            >
                <Table
                    pagination={false}
                    columns={[
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: 'name',
                            align: 'center',
                        },
                        {
                            title: 'Màu sắc',
                            dataIndex: 'color',
                            align: 'center',
                        },
                        {
                            title: 'Giá',
                            dataIndex: 'price',
                            name: 'price',
                            align: 'center',
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
                        {
                            title: 'Số lượng',
                            dataIndex: 'quantity',
                            align: 'center',
                            // render: (value, record) => {
                            //     return (
                            //         <InputNumber
                            //             min={0}
                            //             max={record.totalStock}
                            //             formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            //             // parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            //             parser={handleParser}
                            //             defaultValue={0}
                            //             onChange={(value) => {
                            //                 setnewArray((pre) =>
                            //                     pre.map((cart) => {
                            //                         if (record.id === cart.id) {
                            //                             cart.total = cart.price * value;
                            //                             cart.quantity = value;
                            //                         }
                            //                         return cart;
                            //                     }),
                            //                 );
                            //                 setCheckArray(true);
                            //                 console.log(record.totalStock);
                            //             }}
                            //         ></InputNumber>
                            //     );
                            // },
                        },
                        {
                            title: 'Tổng',
                            dataIndex: 'total',
                            render: (value) => {
                                return (
                                    <>
                                        {formatMoney(value, {
                                            groupSeparator: ',',
                                            decimalSeparator: '.',
                                            currentcy: 'đ',
                                            currentcyPosition: 'BACK',
                                            currentDecimal: '0',
                                        })}
                                    </>
                                );
                            },
                        },
                    ]}
                    dataSource={cartItem}
                    summary={(data) => {
                        const total = data.reduce((pre, current) => {
                            return pre + current.total;
                        }, 0);
                        return (
                            <span>
                                Tổng trả:{' '}
                                {formatMoney(total, {
                                    groupSeparator: ',',
                                    decimalSeparator: '.',
                                    currentcy: 'đ',
                                    currentcyPosition: 'BACK',
                                    currentDecimal: '0',
                                })}
                            </span>
                        );
                    }}
                ></Table>
                <Button
                    type="primary"
                    onClick={() => {
                        setCheckoutDrawerOpen(true);
                        setCartDrawer(false);
                    }}
                >
                    Thanh toán
                </Button>
            </Drawer>
            <Drawer
                open={checkoutDrawerOpen}
                onClose={() => {
                    setCheckoutDrawerOpen(false);
                }}
                contentWrapperStyle={{ width: 400 }}
            >
                <Form onFinish={onConfirmOrder}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please Enter your full name',
                            },
                        ]}
                        label="Full Name"
                        name="full_name"
                    >
                        <Input placeholder="Enter your full name ..." />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Please Enter a valid email',
                            },
                        ]}
                        label="Email"
                        name="your_email"
                    >
                        <Input placeholder="Enter your email ..." />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please Enter your address',
                            },
                        ]}
                        label="Address"
                        name="your_address"
                    >
                        <Input placeholder="Enter your address ..." />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox defaultChecked disabled>
                            Cash on Delivery
                        </Checkbox>
                        <Typography.Paragraph type="secondary">More method coming soom</Typography.Paragraph>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Confirm Order
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
}

export default AppHeader;
