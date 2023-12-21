/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import './OrderPage.scss';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchAsyncProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
import { formatPrice } from '../../../utils/helpers';
// import { addToCart, getCartMessageStatus, setCartMessageOff, setCartMessageOn } from '../../store/cartSlice';
// import CartMessage from '../../components/CartMessage/CartMessage';
import Loading from '@components/common/loading';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { formatMoney } from '@utils';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Button, Checkbox, Form, Input, Result, Space, Steps, Table, Tag, Typography, message, theme } from 'antd';
import axios from 'axios';
import ListDetailsForm from './ListDetailsForm';
import useDisclosure from '@hooks/useDisclosure';
import PageWrapper from '@components/common/layout/PageWrapper';
import routes from '@routes';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { IconLoader } from '@tabler/icons-react';
import { defineMessage } from 'react-intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import SelectField from '@components/common/form/SelectField';
import { paymentOptions } from '@constants/masterData';
const { Text } = Typography;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const OrderPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [detail, setDetail] = useState([]);
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [form] = Form.useForm();
    // const description = 'This is a description.';

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const {
        data: cartItem,
        loading: allproductsLoading,
        execute: executgeallproducts,
    } = useFetch(apiConfig.cart.getList, {
        immediate: true,
        mappingData: ({ data }) => data.cartDetailDtos,
    });

    const sharedOnCell = (_, index) => {
        if (index === 1) {
            return {
                colSpan: 0,
            };
        }
        return {};
    };

    const steps = [
        {
            title: 'Đơn hàng',
            status: 'finish',
            icon: <SolutionOutlined />,
            content: (
                <Table
                    pagination={false}
                    columns={[
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: ['productName'],
                            align: 'center',
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
                    bordered
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
            ),
            decription: decription.first,
        },
        {
            title: 'Thanh toán',
            status: 'process',
            icon: <IconLoader />,
            content: (
                <Form
                    // onFinish={onConfirmOrder}
                    labelCol={{
                        span: 7,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 900,
                        marginTop:20,
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
                    <Button type="primary" htmlType="submit" style={{ marginBottom:20 }}>
                        Confirm Order
                    </Button>
                </Form>
            ),
            decription: decription.second,
        },
        {
            title: 'Hoàn thành',
            status: 'wait',
            icon: <SmileOutlined />,
            content: (
                <Result
                    status="success"
                    title="Successfully Purchased Cloud Server ECS!"
                    subTitle="Mã đơn hàng: 2017182818828182881 Vui lòng theo dõi email để biết quá trình giao hàng."
                    extra={[
                        <Button type="primary" key="console">
                            Quay về trang chủ
                        </Button>,
                        <Button key="buy">Mua lại</Button>,
                    ]}
                />
            ),
            decription: decription.third,
        },
    ];
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        width: 1100,
    };

    const [quantity, setQuantity] = useState(1);

    // useEffect(() => {
    //     if (product?.length > 0) setDetail(product);
    //     else setDetail([]);
    // }, [product]);

    // getting single product
    // useEffect(() => {
    //     dispatch(fetchAsyncProductSingle(id));

    //     if (cartMessageStatus) {
    //         setTimeout(() => {
    //             dispatch(setCartMessageOff());
    //         }, 2000);
    //     }
    // }, [cartMessageStatus]);

    return (
        <div className="con1 py-4 bg-whitesmoke" style={{ display: 'flex', justifyContent: 'start', marginLeft: 200 }}>
            <PageWrapper
                routes={[
                    {
                        breadcrumbName: 'Trang chủ',
                        path: generatePath(routes.homePage.path),
                    },
                    { breadcrumbName: 'Đặt hàng' },
                ]}
                // title={title}
            >
                <Steps current={current} items={items} size="large" />
                <div style={contentStyle}>{steps[current].content}</div>
                <div
                    style={{
                        marginTop: 24,
                    }}
                >
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button
                            style={{
                                margin: '0 8px',
                            }}
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}
                </div>
            </PageWrapper>
        </div>
    );
};

export default OrderPage;
