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
import { formatMoney } from '@utils';
import { IconEdit, IconEditCircle, IconEditCircleOff, IconMinus, IconPlus, IconPlusMinus } from '@tabler/icons-react';
import {
    Button,
    Checkbox,
    Divider,
    Form,
    Input,
    Result,
    Space,
    Steps,
    Table,
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
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { IconLoader } from '@tabler/icons-react';
import { defineMessage } from 'react-intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import SelectField from '@components/common/form/SelectField';
import { paymentOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import { showErrorMessage } from '@services/notifyService';
import useTranslate from '@hooks/useTranslate';
const { Text } = Typography;
let index = 0;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const ResultSuccess = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const translate = useTranslate();
    const [item1, setItem1] = useState(null);
    const queryParameters = new URLSearchParams(window.location.search);
    const payerId = queryParameters.get('PayerID');
    const paymentId = queryParameters.get('paymentId');
    const orderId = queryParameters.get('orderId');

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(2);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const { execute: executeSuccessPay } = useFetch({
        ...apiConfig.transaction.successPay,
    });

    useEffect(() => {
      executeSuccessPay({
        params:{
            PayerID : payerId,
            paymentId :paymentId,
            orderId  : orderId,
        },
        onCompleted: (respone) => {

        },
      });
    }, []);


    const steps = [
        {
            title: 'Đơn hàng',
            status: 'finish',
            // icon: <SolutionOutlined />,
            decription: decription.first,
        },
        {
            title: 'Thanh toán',
            status: 'finish',
            // icon: <LoadingOutlined />,
            decription: decription.second,
        },
        {
            title: 'Hoàn thành',
            status: 'finish',
            // icon: <SmileOutlined />,
            content: (
                <Result
                    status="success"
                    title="Đơn hàng của bạn đang được xử lý"
                    subTitle="Vui lòng theo dõi email để biết quá trình giao hàng."
                    extra={[
                        <Button type="primary" key="console">
                            <a href="/">Quay về trang chủ</a>
                        </Button>,
                        <Button key="buy">
                            <a href="/all-product">Xem sản phẩm khác</a>
                        </Button>,
                    ]}
                />
            ),
            decription: decription.third,
        },
    ];
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
        icon: item.icon,
        status: item.status,
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
                    {/* {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )} */}
                    {/* {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )} */}
                    {current > 0 && current < steps.length - 1 && (
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

export default ResultSuccess;
