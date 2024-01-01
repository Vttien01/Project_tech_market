/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { paidValues, paymentOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { IconEdit, IconStarFilled } from '@tabler/icons-react';
import { Avatar, Card, Divider, Form, List, Rate, Space, Table, Tabs, Tooltip, Typography, theme } from 'antd';
import { defineMessage } from 'react-intl';
import ListDetailsForm from './ListDetailsForm';
import { convertUtcToLocalTime, formatMoney } from '@utils';
import { DEFAULT_FORMAT } from '@constants';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
const { Text } = Typography;
let index = 0;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const EvaluatePage = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [form] = Form.useForm();
    const translate = useTranslate();

    const { token } = theme.useToken();

    const {
        data: detail,
        loading: loadingMyReview,
        execute: executeMyReview,
    } = useFetch(apiConfig.review.getMyReview, {
        immediate: true,
    });

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

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
                    { breadcrumbName: 'Trang cá nhân', path: routes.PersonInfo.path },
                    { breadcrumbName: 'Đánh giá sản phẩm' },
                ]}
                // title={title}
                style={{ backgroundColor: '#282a36' }}
            ></PageWrapper>
            <div style={{ flex: '1', justifyContent: 'center', minHeight: 600 }}>
                <Card style={{ backgroundColor: '#d8dadd' }}>
                    <Divider orientation="left" style={{ fontSize: 25 }}>
                        Danh sách các đánh giá của người dùng
                    </Divider>
                    <List
                        pagination={true}
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={detail?.data}
                        style={{ marginBottom: 10 }}
                        renderItem={(item) => (
                            <Card style={{ backgroundColor: '#eff0f1', marginTop: 10 }}>
                                <List.Item
                                    itemLayout="vertical"
                                    key={item?.id}
                                    actions={[
                                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item?.image} size={100} alt="" />}
                                        title={
                                            <a href="https://ant.design" style={{ fontSize: 25 }}>
                                                {item?.productName}
                                            </a>
                                        }
                                        description={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    <Rate disabled allowHalf value={item?.star} />
                                                </div>
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    Màu: {item.color}
                                                </div>
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    Ngày tạo: {''}
                                                    <span>
                                                        {convertUtcToLocalTime(
                                                            item?.createdDate,
                                                            DEFAULT_FORMAT,
                                                            DEFAULT_FORMAT,
                                                        )}
                                                    </span>
                                                </div>
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    <Typography.Paragraph
                                                        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                                                        style={{ fontSize: 18 }}
                                                    >
                                                        Nội dung: {item?.message}
                                                    </Typography.Paragraph>
                                                </div>
                                            </div>
                                        }
                                    />
                                    {/* <div>
                                        {
                                            <Tooltip title="Đánh giá sản phẩm">
                                                <Rate disabled allowHalf value={item?.star} />
                                            </Tooltip>
                                        }
                                    </div> */}
                                </List.Item>
                            </Card>
                        )}
                    />
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
    const [dataOrder, setDataOrder] = useState({});
    // const [state, setState] = useState(null);
    const isPaidValues = translate.formatKeys(paidValues, ['label']);

    const {
        data: myOrder,
        loading: loadingMyOrder,
        execute: executeMyOrder,
    } = useFetch(apiConfig.review.getUnratedProduct, {
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

    const handleFetchDetail = (record) => {
        // executeDetailOrder({
        //     pathParams: { id: record.id },
        //     onCompleted: (response) => {
        //         setDetail(response.data);
        //         setDataOrder(record);
        //     },
        // });
        console.log(1);
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
                title: 'Người nhận',
                dataIndex: 'receiver',
                align: 'center',
            },
        ];

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
                state={state}
                dataOrder={dataOrder}
            />
            <Table
                pagination={true}
                onRow={(record, rowIndex) => ({
                    onClick: (e) => {
                        e.stopPropagation();
                        handleFetchDetail(record);
                        handlerDetailsModal.open();
                    },
                })}
                columns={itemHeader()}
                dataSource={myOrder}
                bordered
                style={{ cursor: 'pointer' }}
            ></Table>
        </div>
    );
}

export default EvaluatePage;
