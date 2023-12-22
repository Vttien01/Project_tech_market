import React, { useEffect, useState } from 'react';
import {
    Layout,
    Menu,
    Avatar,
    Space,
    Image,
    Input,
    ConfigProvider,
    Badge,
    Form,
    Checkbox,
    Typography,
    Button,
    Drawer,
    InputNumber,
    Table,
    message,
    Tag,
} from 'antd';
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
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { commonMessage } from '@locales/intl';
import SelectField from '@components/common/form/SelectField';
import { paymentOptions } from '@constants/masterData';
import { showErrorMessage } from '@services/notifyService';
const { Search } = Input;
const { Text } = Typography;

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

    const itemHeader = () => {
        const items = [
            {
                // icon: <ShoppingCartOutlined style={{ fontSize: 22 }} />,
                icon: <AppCart />,
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
                <Header className={styles.appHeader2} style={{ paddingLeft: 150, borderBottom: '1px solid #f57e20' }}>
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
    const { profile } = useAuth();
    const navigate = useNavigate();
    const translate = useTranslate();

    const [CartDrawer, setCartDrawer] = useState(false);
    const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
    const [cartItem, setCartItem] = useState([]);
    const [total, setTotal] = useState(0);

    const {
        data: cart,
        execute: getCartExcute,
        loading,
    } = useFetch({
        ...apiConfig.cart.getList,
    });

    const {
        data: order,
        execute: createOrderForGuest,
    } = useFetch({
        ...apiConfig.order.create,
    });
    useEffect(() => {
        if (!profile) {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            console.log(storedCart);
            setCartItem(storedCart);
            calculateTotal(storedCart);
        } else {
            console.log(profile);
            getCartExcute({
                onCompleted: (response) => {
                    // setCacheAccessToken(res.access_token);
                    // executeGetProfile();
                    setCartItem(response.data.cartDetailDtos);
                },
                onError: () => {
                    // showErrorMessage(translate.formatMessage(message.loginFail));
                    // form.resetFields();
                    console.log('Lỗi');
                },
            });
        }
    }, []);
    console.log(cartItem);

    const calculateTotal = (cartItems) => {
        const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };
    function onConfirmOrder(values) {
        let array2 = new Array(cartItem.length).fill(null);

        array2 = cartItem.map((item) => ({
            color: item.color,
            price: item.price,
            productName: item.productName,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
        }));
        const updatedValues = {
            ...values,
            listOrderProduct: array2, // Thay yourListOrderProductArray bằng mảng thực tế của bạn
        };
        createOrderForGuest({
            data: { ...updatedValues },
            onCompleted: (res) => {
                // setCacheAccessToken(res.access_token);
                // executeGetProfile();
                setCheckoutDrawerOpen(false);
                message.success('Đặt hàng thành công');
            },
            onError: () => {
                showErrorMessage(translate.formatMessage(message.loginFail));
            },
        });
        console.log(updatedValues);
        // message.success('Đặt hàng thành công');
    }
    return (
        <div>
            <Badge
                onClick={() => {
                    setCartDrawer(true);
                }}
                count={cartItem?.length}
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
                contentWrapperStyle={{ width: 650 }}
            >
                {profile ? (
                    <Table
                        pagination={false}
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                dataIndex: 'productName',
                                align: 'center',
                                width:200,
                            },
                            {
                                title: 'Màu sắc',
                                dataIndex: [ 'color'],
                                align: 'center',
                            },
                            {
                                title: 'Giá',
                                dataIndex: [ 'price'],
                                name: 'price',
                                align: 'center',
                                width:150,
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
                            },
                            {
                                title: 'Tổng',
                                dataIndex: 'totalPriceSell',
                                width:150,
                                align: 'center',
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
                                return pre + current.totalPriceSell;
                            }, 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align="end">
                                        <Tag color={'green'} style={{ fontSize: 18, fontWeight: 700 }}>
                                            Tổng trả
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Text type="danger" style={{ fontWeight: 700 }}>
                                            {formatMoney(total, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    ></Table>
                ) : (
                    <Table
                        pagination={false}
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                dataIndex: 'productName',
                                align: 'center',
                                width:200,
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
                                width:150,
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
                            },
                            {
                                title: 'Tổng',
                                dataIndex: 'totalPriceSell',
                                width:150,
                                align: 'center',
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
                                return pre + current.totalPriceSell;
                            }, 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align="end">
                                        <Tag color={'green'} style={{ fontSize: 18, fontWeight: 700 }}>
                                            Tổng trả
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Text type="danger" style={{ fontWeight: 700 }}>
                                            {formatMoney(total, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    ></Table>
                )}

                <Button
                    type="primary"
                    style={{ marginTop:20 }}
                    onClick={() => {
                        console.log(profile);
                        profile ? navigate(routes.OderPage.path) : setCheckoutDrawerOpen(true);
                        setCartDrawer(false);
                    }}
                >
                    Đặt hàng
                </Button>
            </Drawer>
            <Drawer
                open={checkoutDrawerOpen}
                onClose={() => {
                    setCheckoutDrawerOpen(false);
                }}
                title="Đặt hàng"
                contentWrapperStyle={{ width: 650 }}
            >
                <Form
                    onFinish={onConfirmOrder}
                    labelCol={{
                        span: 7,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền tên',
                            },
                        ]}
                        label="Họ và tên"
                        name="receiver"
                        contentWrapperStyle={{ width: 200 }}
                    >
                        <Input placeholder="Nhập tên ..." />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Vui lòng điền email',
                            },
                        ]}
                        label="Email"
                        name="email"
                    >
                        <Input placeholder="Nhập email ..." />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền địa chỉ',
                            },
                        ]}
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input placeholder="Nhập địa chỉ ..." />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền số điện thoại',
                            },
                        ]}
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input placeholder="Nhập số điện thoại ..." />
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note">
                        <Input placeholder="Nhập ghi chú ..." />
                    </Form.Item>
                    <Form.Item labelAlign="right" label="Mã giảm giá" name="voucherId">
                        <Input placeholder="Nhập mã giảm giá ..." />
                    </Form.Item>
                    <AutoCompleteField
                        label="Tỉnh"
                        name="province"
                        apiConfig={apiConfig.nation.autocomplete}
                        mappingOptions={(item) => ({ value: item.name, label: item.name })}
                        initialSearchParams={{ kind: 1 }}
                        searchParams={(text) => ({ name: text, kind: 1 })}
                    />
                    <AutoCompleteField
                        label="Quận"
                        name="district"
                        apiConfig={apiConfig.nation.autocomplete}
                        mappingOptions={(item) => ({ value: item.name, label: item.name })}
                        initialSearchParams={{ kind: 2 }}
                        searchParams={(text) => ({ name: text, kind: 2 })}
                    />
                    <AutoCompleteField
                        label="Huyện"
                        name="ward"
                        apiConfig={apiConfig.nation.autocomplete}
                        mappingOptions={(item) => ({ value: item.name, label: item.name })}
                        initialSearchParams={{ kind: 3 }}
                        searchParams={(text) => ({ name: text, kind: 3 })}
                    />

                    <SelectField
                        name="paymentMethod"
                        label="Hình thức thanh toán"
                        allowClear={false}
                        options={paymentOptions}
                        required
                    />
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
