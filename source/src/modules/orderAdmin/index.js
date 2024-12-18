import { CheckOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
    storageKeys,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { orderStateOption, orderStateValue, paidValues, paymentOptions, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import { getCacheAccessToken } from '@services/userService';
import { convertToCamelCase, convertUtcToLocalTime, formatDateString, formatMoney } from '@utils';
import { getData } from '@utils/localStorage';
import { Button, DatePicker, Flex, Modal, Popover, Tag, Tooltip } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { get, values } from 'lodash';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

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
    const [loadingExport, setLoadingExport] = useState(false);
    const { execute: executeUpdateOrder, loading: loadingUpdateOrder } = useFetch(apiConfig.order.update, {
        immediate: false,
    });
    const { execute: executeExportExcel, loading: loadingExportExcel } = useFetch(apiConfig.report.getOrders, {
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
                                        showWarningMessage('Đơn hàng chưa được thanh toán');
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
                executeUpdateOrder({
                    data: {
                        id: record.id,
                        isPaid: record.isPaid,
                        state: orderStatetateAdmin[state + 1].value,
                        expectedDeliveryDate: formatDateString(dayjs().add(2, 'day'), DEFAULT_FORMAT),
                        orderCode: record.orderCode,
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

    const changeMoney = (value) => {
        if (!value) return '0đ';
        return formatMoney(value, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: 'đ',
            currentcyPosition: 'BACK',
            currentDecimal: '0',
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
            width: 130,
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
            name: 'totalMoney',
            align: 'center',
            render: (record) => {
                const arrayVoucher = [
                    {
                        name: 'Tổng phụ',
                        value: record?.originalTotal,
                    },
                    {
                        name: 'Giảm giá sản phẩm',
                        value: record?.totalPriceSaleOff,
                    },
                    {
                        name: 'Giảm giá voucher',
                        value: record?.totalPriceVoucher,
                    },
                ];
                return (
                    <Flex align="center" justify="center" gap={8}>
                        <div>{changeMoney(record?.totalMoney)}</div>
                        {record?.totalPriceVoucher && (
                            <Popover
                                trigger={'hover'}
                                title={
                                    <Flex vertical gap={'small'} style={{ margin: 0 }}>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontFamily: 'Poppins',
                                                borderBottom: 'solid 1px #bfbfbf',
                                            }}
                                        >
                                            <span style={{ marginLeft: 10 }}>Chi tiết giảm giá voucher</span>
                                        </div>
                                        {arrayVoucher.map((item, index) => (
                                            <Flex justify="space-between" key={index}>
                                                <span style={{ fontWeight: 600 }}>{item.name}: </span>
                                                <span style={{ fontWeight: 400 }}>{changeMoney(item.value)}</span>
                                            </Flex>
                                        ))}
                                    </Flex>
                                }
                                placement={'bottom'}
                                overlayInnerStyle={{
                                    width: 280,
                                    background: 'white',
                                    color: 'black',
                                    // position: 'absolute',
                                    // right: -9,
                                    // top: -100,
                                    // padding: 0,
                                    // zIndex: 1000,
                                    // marginRight: 0,
                                }}
                                className={styles.popover}
                            >
                                <ExclamationCircleOutlined style={{ fontSize: 20 }} />
                            </Popover>
                        )}
                    </Flex>
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

    const paidOptions = [
        { value: 0, label: 'Chưa thanh toán' },
        { value: 1, label: 'Đã thanh toán' },
    ];

    const searchFields = [
        {
            key: 'orderCode',
            placeholder: 'Mã đơn hàng',
        },
        {
            key: 'userId',
            placeholder: 'Mã người dùng',
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.user.getList,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.account.fullName,
            }),
            searchParams: (text) => {
                // mixinFuncs.setQueryParams({ name: text });
                return { fullName: text };
            },
            submitOnChanged: true,
        },
        {
            key: 'isPaid',
            placeholder: 'Trạng thái thanh toán',
            type: FieldTypes.SELECT,
            options: paidOptions,
            submitOnChanged: true,
        },
        {
            key: 'paymentMethod',
            placeholder: 'Hình thức trả tiền',
            type: FieldTypes.SELECT,
            options: stateValues,
            submitOnChanged: true,
        },
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
    const userAccessToken = getCacheAccessToken();

    const handleExportExcel = (id) => {
        setLoadingExport(true);
        axios({
            url: `${apiConfig.report.getOrders.baseURL}${search}`,
            method: 'GET',
            responseType: 'blob',
            // withCredentials: true,
            headers: {
                Authorization: `Bearer ${userAccessToken}`, // Sử dụng token từ state
            },
        })
            .then((response) => {
                const date = new Date();

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `Danh_sach_don_hang_${formatDateString(date)}.xlsx`;
                link.click();
                setLoadingExport(false);
                showSucsessMessage('Tạo danh sách đơn hàng thành công!');
            })
            .catch((error) => {
                setLoadingExport(false);
                showErrorMessage('Tạo danh sách đơn hàng thất bại!');
            });
    };

    return (
        <ListPage
            searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
            actionBar={
                <Flex justify="end">
                    <Button type="primary" size="large" loading={loadingExport} onClick={() => handleExportExcel()}>
                        Export to Excel
                    </Button>
                </Flex>
            }
            baseTable={
                <BaseTable
                    onRow={(record, rowIndex) => ({
                        onClick: (e) => {
                            e.stopPropagation();
                            handleFetchDetail(record.id);
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
