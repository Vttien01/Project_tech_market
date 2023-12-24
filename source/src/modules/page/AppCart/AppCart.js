/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import Loading from '@components/common/loading';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { formatMoney } from '@utils';
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Divider,
    Drawer,
    Form,
    Input,
    Result,
    Space,
    Steps,
    Table,
    Tabs,
    Tag,
    Typography,
    message,
    theme,
} from 'antd';
import routes from '@routes';
import { defineMessage } from 'react-intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import SelectField from '@components/common/form/SelectField';
import { paymentOptions, statusOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import useTranslate from '@hooks/useTranslate';
const { Text } = Typography;
import { ShoppingCartOutlined } from '@ant-design/icons';
import { paymentSelect } from '@constants';

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const AppCart = () => {
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

    const { data: order, execute: createOrderForGuest } = useFetch({
        ...apiConfig.order.create,
    });
    useEffect(() => {
        if (!profile) {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItem(storedCart);
            calculateTotal(storedCart);
        } else {
            getCartExcute({
                onCompleted: (response) => {
                    // setCacheAccessToken(res.access_token);
                    // executeGetProfile();
                    setCartItem(response.data.cartDetailDtos);
                },
                onError: () => {
                    showErrorMessage("Không lấy được giả hàng!");
                    // form.resetFields();
                },
            });
        }
    }, []);

    const calculateTotal = (cartItems) => {
        const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    const { execute: createTransaction } = useFetch({
        ...apiConfig.transaction.create,
    });

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
            onCompleted: (respone) => {
                if (values.paymentMethod === 1) {
                    createTransaction({
                        data: {
                            orderId: respone.data.orderId,
                            urlCancel: 'http://localhost:3000/my-order-fail',
                            urlSuccess: 'http://localhost:3000/my-order-success',
                        },
                        onCompleted: (res) => {
                            window.location.href = res.data;
                            // setCheckoutDrawerOpen(false);
                            // showSucsessMessage('Đặt hàng thành công');
                        },
                        onError: () => {
                            showErrorMessage(translate.formatMessage('Thanh toán thất bại!'));
                        },
                    });
                } else {
                    localStorage.clear();
                    setCheckoutDrawerOpen(false);
                    showSucsessMessage('Đặt hàng thành công');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1800);
                }
            },
            onError: () => {
                showErrorMessage('Đặt hàng thất bại');
            },
        });
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
                                width: 200,
                            },
                            {
                                title: 'Màu sắc',
                                dataIndex: ['color'],
                                align: 'center',
                            },
                            {
                                title: 'Giá',
                                dataIndex: ['price'],
                                name: 'price',
                                align: 'center',
                                width: 150,
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
                                width: 150,
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
                                width: 200,
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
                                width: 150,
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
                                width: 150,
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
                    style={{ marginTop: 20 }}
                    onClick={() => {
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
                        options={paymentSelect}
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
};

export default AppCart;
