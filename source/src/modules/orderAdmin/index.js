import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import DatePickerField from '@components/common/form/DatePickerField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_VALUE,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    STATE_CANCELED,
    STATE_CONFIRMED,
    STATE_PENDING,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { orderStateOption, orderStateValue, paidValues, paymentOptions, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import { convertUtcToLocalTime, formatDateString, formatMoney } from '@utils';
import { Button, DatePicker, Modal, Tag } from 'antd';
import { values } from 'lodash';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Đơn hàng',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    category: 'Danh mục hệ',
});

const OrderAdminPage = ({ state }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(paymentOptions, ['label']);
    const orderStatetateValues = translate.formatKeys(orderStateOption, ['label']);
    const orderStatetateAdmin = translate.formatKeys(orderStateValue, ['label']);
    const isPaidValues = translate.formatKeys(paidValues, ['label']);
    const { pathname: pagePath, search } = useLocation();
    const { execute: executeUpdateOrder, loading: loadingUpdateOrder } = useFetch(apiConfig.order.update, {
        immediate: false,
    });

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams } = useListBase({
        apiConfig: apiConfig.order,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    state,
                };
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    confirm: (record) => (
                        <BaseTooltip title="Xác nhận đơn hàng">
                            <Button
                                key={record._id}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (record.state == STATE_CONFIRMED && record.isPaid == false) {
                                        showWarningMessage('Bạn phải thanh toán đơn hàng');
                                    } else showConfirmItemConfirm(record);
                                }}
                            >
                                <CheckOutlined style={{ color: 'green' }} />
                            </Button>
                        </BaseTooltip>
                    ),
                };
            };
        },
    });

    const showConfirmItemConfirm = (record) => {
        const state = orderStatetateAdmin.findIndex((item) => item.value == record.state);
        return Modal.confirm({
            title: 'Hủy đơn hàng',
            content: `Bạn có chắc muốn ${orderStatetateAdmin[state + 1].label} đơn hàng?`,
            okText: 'Xác nhận',
            cancelText: 'Đóng',
            centered: true,
            onOk: () => {
                // handleCancelOrder(id);
                executeUpdateOrder({
                    data: {
                        id: record.id,
                        isPaid: record.isPaid,
                        state: orderStatetateAdmin[state + 1].value,
                    },
                    onCompleted: () => {
                        showSucsessMessage('Cập nhật đơn hàng thành công');
                        mixinFuncs.getList();
                    },
                    onError: () => {
                        showErrorMessage('Cập nhật đơn hàng thất bại');
                    },
                });
            },
        });
    };

    const columns = [
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
            title: 'Ngày dự kiến nhận hàng',
            dataIndex: 'expectedDeliveryDate',
            align: 'center',
            render: (expectedDeliveryDate) => {
                const result = convertUtcToLocalTime(expectedDeliveryDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                return <div>{result}</div>;
            },
        },
        {
            title: 'Người nhận',
            dataIndex: 'receiver',
            align: 'center',
        },
        {
            title: 'Hình thức trả tiền',
            dataIndex: 'paymentMethod',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag
                        color={state.color}
                        style={{ minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{ padding: '3px 0px 3px 0px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'isPaid',
            align: 'center',
            render(dataRow) {
                const state = isPaidValues.find((item) => item.value == dataRow);
                return (
                    <Tag
                        color={state.color}
                        style={{
                            minWidth: 80,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div style={{ padding: '0 0px', fontSize: 14 }}>{state.label}</div>
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
        // mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                confirm: state == null || state == STATE_PENDING || state == STATE_CONFIRMED,
                edit: state != STATE_CANCELED,
            },
            { width: '120px' },
        ),
    ];

    const handleSearch = (date, dateString) => {
        console.log(date);
    };

    const searchFields = [
        {
            key: 'orderCode',
            placeholder: 'Mã đơn hàng',
        },
        {
            key: 'userId',
            placeholder: 'Mã người dùng',
        },
        // {
        //     key: 'state',
        //     placeholder: 'Tình trạng đơn hàng',
        //     type: FieldTypes.SELECT,
        //     options: orderStatetateValues,
        // },
        // {
        //     key: 'createDate',
        //     placeholder: 'Ngày đặt',
        //     type: FieldTypes.DATE,
        //     format: DATE_FORMAT_VALUE,
        // },
    ];
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.objectName) }];

    const handleFetchDetail = (id) => {
        navigate(routes.DetailOrderAdmin.path + `?state=${state}&orderId=${id}`);
    };

    return (
        <ListPage
            searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
            actionBar={mixinFuncs.renderActionBar()}
            baseTable={
                <BaseTable
                    onRow={(record, rowIndex) => ({
                        onClick: (e) => {
                            e.stopPropagation();
                            handleFetchDetail(record.id);

                            // handlersModal.open();
                        },
                    })}
                    onChange={changePagination}
                    pagination={pagination}
                    loading={loading || loadingUpdateOrder}
                    dataSource={data}
                    columns={columns}
                    style={{ cursor: 'pointer' }}
                />
            }
        />
    );
};

export default OrderAdminPage;
