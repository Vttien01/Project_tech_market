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
    List,
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
import { LoadingOutlined, SmileOutlined, SolutionOutlined, SearchOutlined } from '@ant-design/icons';
import { IconLoader } from '@tabler/icons-react';
import { defineMessage } from 'react-intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import SelectField from '@components/common/form/SelectField';
import { paymentOptions, statusOptions } from '@constants/masterData';
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
import Avatar from 'antd/es/avatar/avatar';
const { Text } = Typography;
let index = 0;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const HistoryOrderGuest = () => {
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
    const [search, setSearch] = useState('');
    const [checkSearch, setCheckSearch] = useState(false);

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
        setItem1(item);
        handlerDetailsModal.open();
    };

    const { data: myOrder, execute: executeSearchOrder } = useFetch({
        ...apiConfig.orderDetail.getByPhoneAndOrder,
    });

    const onSearch = (value, _e, info) => {
        // setSearch(value.orderCode);
        if (value.orderCode !== '') {
            executeSearchOrder({
                params: { orderCode: value.orderCode },
                onCompleted: (response) => {
                    // console.log(response.data.content);
                    if (response !== null) {
                        setCheckSearch(true);
                        const data = response.data.content;
                        console.log(data);
                        setSearch(response.data.content);
                    } else {
                        setCheckSearch(false);
                    }
                },
            });
        }
        else  setCheckSearch(false);
    };

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const [quantity, setQuantity] = useState(1);

    const steps = [
        {
            label: `Chi tiết đơn hàng`,
            key: 1,
            children: checkSearch ? (
                <TableMyOrder search={myOrder} />
            ) : (
                <Result
                    icon={<SearchOutlined />}
                    title="Vui lòng nhập mã đơn hàng!"
                    extra={
                        <Button type="primary">
                            <a href="/">Quay về trang chủ</a>
                        </Button>
                    }
                />
            ),
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
                    {
                        breadcrumbName: 'Trang chủ',
                        path: generatePath(routes.homePage.path),
                    },
                    { breadcrumbName: 'Tìm kiếm đơn hàng' },
                ]}
                // title={title}
            ></PageWrapper>
            <div
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: 500,
                    marginBottom: 20,
                    marginLeft: 300,
                }}
            >
                <div style={{ flex: '1', justifyContent: 'center' }}>
                    <Form onFinish={onSearch}>
                        <div style={{ display: 'flex' }}>
                            <Form.Item name="orderCode" contentWrapperStyle={{ width: 800 }}>
                                <Input
                                    placeholder="Nhập mã đơn hàng ..."
                                    addonAfter={<IconSearch />}
                                    style={{ minWidth: 500 }}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ marginTop: 5, marginLeft: 5, backgroundColor: '#f57e20' }}
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <div style={{ flex: '1', justifyContent: 'center', minHeight: 300 }}>
                <Card style={{ minHeight: 600, backgroundColor: '#d8dadd' }}>
                    <Tabs defaultActiveKey="1" centered size="large" items={items} style={{ marginBottom: 20 }} />
                </Card>
            </div>
        </div>
    );
};

function TableMyOrder({ stateValues, state, search }) {
    const [form] = Form.useForm();
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [detail, setDetail] = useState([]);
    const [check, setCheck] = useState(false);

    console.log(search);

    // const {
    //     data: myOrder,
    //     loading: loadingMyOrder,
    //     execute: executeMyOrder,
    // } = useFetch(apiConfig.order.myOrder, {
    //     immediate: true,
    //     mappingData: ({ data }) => data.content,
    //     params: { state: state },
    // });

    // const { execute: executeDetailOrder } = useFetch({
    //     ...apiConfig.orderDetail.getByOrder,
    // });

    // if (search !== null) {
    //     executeSearchOrder({
    //         params: { orderCode: search },
    //         onCompleted: (response) => {
    //             setDetail(response.data);
    //         },
    //     });
    // }

    return (
        <div>
            <ListDetailsForm
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                form={form}
                detail={detail}
                isEditing={!!detail}
            />
            <Card>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={search.data.content}
                    style={{ marginBottom: 10 }}
                    renderItem={(item) => (
                        <Card style={{ backgroundColor: '#eff0f1', marginTop: 10 }}>
                            <List.Item key={item?.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item?.image} size={100} />}
                                    title={<a style={{ fontSize:25 }} href="https://ant.design">{item?.name}</a>}
                                    // description={item?.price}
                                    description={
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div style={{ flex: '1', justifyContent: 'center' }}>
                                                Số lượng: {item.amount}
                                            </div>
                                            <div style={{ flex: '1', justifyContent: 'center' }}>Màu: {item.color}</div>
                                            <div style={{ flex: '1', justifyContent: 'center', fontSize:20 }}>
                                                {' '}
                                                Tổng tiền:{' '}
                                                {formatMoney(item?.price, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </div>
                                        </div>
                                    }
                                />
                                {/* <div>
                                    <IconTrash color="#f32020" />
                                </div> */}
                            </List.Item>
                        </Card>
                    )}
                />
            </Card>
        </div>
    );
}

export default HistoryOrderGuest;
