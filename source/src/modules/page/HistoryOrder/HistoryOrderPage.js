/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
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
import { convertUtcToLocalTime, formatMoney } from '@utils';
import {
    IconEdit,
    IconEditCircle,
    IconEditCircleOff,
    IconMinus,
    IconPlus,
    IconPlusMinus,
    IconHttpDelete,
    IconRecycle,
    IconTrash,
    IconSearch,
} from '@tabler/icons-react';
import {
    Button,
    Card,
    Checkbox,
    Divider,
    Form,
    Input,
    Modal,
    Popconfirm,
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
import axios from 'axios';
import ListDetailsForm from './ListDetailsForm';
import useDisclosure from '@hooks/useDisclosure';
import PageWrapper from '@components/common/layout/PageWrapper';
import routes from '@routes';
import { LoadingOutlined, SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { IconLoader } from '@tabler/icons-react';
import { defineMessage } from 'react-intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import SelectField from '@components/common/form/SelectField';
import { paidOptions, paidValues, paymentOptions, statusOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import useTranslate from '@hooks/useTranslate';
import useListBase from '@hooks/useListBase';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, commonStatus } from '@constants';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { FormattedMessage } from 'react-intl';
import { FieldTypes } from '@constants/formConfig';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import Search from 'antd/es/input/Search';
const { Text } = Typography;
let index = 0;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const HistoryOrderPage = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [form] = Form.useForm();
    const translate = useTranslate();
    const [item1, setItem1] = useState(null);
    const [orderId, setOrderId] = useState(0);
    const stateValues = translate.formatKeys(paymentOptions, ['label']);
    const onSearch = (value, _e, info) => {
        <TableMyOrder search={value} />;
    };
    const renderTitle = (title, item) => (
        <span>
            {title}
            <a
                style={{
                    float: 'right',
                }}
                onClick={() => handleEdit(item)}
            >
                <IconEdit size={17} />
            </a>
        </span>
    );

    const handleEdit = (item) => {
        console.log(item);
        setItem1(item);
        handlerDetailsModal.open();
    };

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const [quantity, setQuantity] = useState(1);

    const steps = [
        {
            label: `Đang Xử Lý`,
            key: 1,
            children: <TableMyOrder stateValues={stateValues} state={1} />,
        },
        {
            label: `Đã được duyệt`,
            key: 2,
            children: <TableMyOrder stateValues={stateValues} state={2} />,
        },
        {
            label: `Hoàn Thành`,
            key: 3,
            children: <TableMyOrder stateValues={stateValues} state={4} />,
        },
        {
            label: `Đã Hủy`,
            key: 4,
            children: <TableMyOrder stateValues={stateValues} state={3} />,
        },
    ];
    const items = steps.map((item) => ({
        label: item.label,
        key: item.key,
        children: item.children,
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

    return (
        <div
            className="con1 py-4 bg-whitesmoke"
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                // height: '100vh',
                marginLeft: 150,
                marginRight: 150,
            }}
        >
            <PageWrapper
                routes={[
                    { breadcrumbName: 'Lịch sử đơn hàng' },
                ]}
                // title={title}
                style={{ backgroundColor:'#282a36' }}
            ></PageWrapper>
            <div style={{ flex: '1', justifyContent: 'center', minHeight: 600 }}>
                <Card style={{ minHeight: 600, backgroundColor: '#d8dadd' }}>
                    <Tabs defaultActiveKey="1" centered size="large" items={items} style={{ marginBottom: 20 }} />
                </Card>
            </div>
        </div>
    );
};

function TableMyOrder({ stateValues, state, search }) {
    const translate = useTranslate();
    const [form] = Form.useForm();
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [detail, setDetail] = useState([]);
    const [check, setCheck] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const isPaidValues = translate.formatKeys(paidValues, ['label']);


    const {
        data: myOrder,
        loading: loadingMyOrder,
        execute: executeMyOrder,
    } = useFetch(apiConfig.order.myOrder, {
        immediate: true,
        mappingData: ({ data }) => data.content,
        params: { state: state },
    });

    // const {
    //     execute: executeDetailOrder,
    // } = useFetch(apiConfig.orderDetail.getByOrder, {
    //     immediate: true,
    // });
    const { execute: executeDetailOrder } = useFetch({
        ...apiConfig.orderDetail.getByOrder,
    });

    const handleFetchDetail = (id) => {
        executeDetailOrder({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            // onError: mixinFuncs.handleGetDetailError,
        });
    };

    const { execute: excuteCancelOrder } = useFetch({
        ...apiConfig.order.cancelMyOrder,
    });

    const handleCancelOrder = (id) => {
        excuteCancelOrder({
            data: { id: id, state: 3 },
            onCompleted: (response) => {
                setCheck(!check);
            },
            // onError: mixinFuncs.handleGetDetailError,
        });
    };
    useEffect(() => {
        executeMyOrder();
    }, [check]);

    const itemHeader = () => {
        const items = [
            {
                title: 'Mã đơn hàng',
                dataIndex: 'orderCode',
                align: 'center',
            },
            {
                title: 'Ngày đặt',
                dataIndex: 'createdDate',
                align: 'center',
                render: (createdDate) => {
                    const result = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                    return <div>{result}</div>;
                },
            },
            {
                title: 'Người nhận',
                dataIndex: 'receiver',
                align: 'center',
            },
            {
                title: 'Phương thức thanh toán',
                dataIndex: 'paymentMethod',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = stateValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color} style={{ width: 65, display: 'flex', justifyContent: 'center' }}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
            {
                title: 'Trạng thái thanh toán',
                dataIndex: 'isPaid',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = isPaidValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color} style={{ width: 110, display: 'flex', justifyContent: 'center' }}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
            {
                title: 'Tổng tiền',
                dataIndex: ['totalMoney'],
                name: 'totalMoney',
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
        ];

        if (state !== 3) {
            items.push({
                title: 'Hành động',
                key: 'action',
                align: 'center',
                render: (_, record) => (
                    <Popconfirm
                        title="Hủy đơn hàng"
                        description="Bạn có chắc muốn hủy đơn hàng này?"
                        onConfirm={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(record.id);
                        }}
                        // onCancel={cancel}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            style={{
                                padding: 3,
                                display: 'table-cell',
                                verticalAlign: 'middle',
                                backgroundColor: '#e70d0d',
                                fontWeight: 600,
                                color: 'white',
                                fontSize: 12,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // handleCancelOrder(record.id);
                            }}
                        >
                            HỦY ĐƠN HÀNG
                        </Button>
                    </Popconfirm>
                ),
            });
        }
        return items;
    };

    return (
        <div>
            {/* <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal> */}
            <ListDetailsForm
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                form={form}
                detail={detail}
                isEditing={!!detail}
                orderId={orderId}
            />
            <Table
                pagination={true}
                onRow={(record, rowIndex) => ({
                    onClick: (e) => {
                        e.stopPropagation();
                        setOrderId(record.id);
                        handleFetchDetail(record.id);
                        handlerDetailsModal.open();
                    },
                })}
                columns={itemHeader()}
                dataSource={myOrder}
                bordered
            ></Table>
        </div>
    );
}

export default HistoryOrderPage;
