import { AppConstants, DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useListBase from '@hooks/useListBase';
import React from 'react';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { orderStateOption, paymentOptions, statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { FieldTypes } from '@constants/formConfig';
import apiConfig from '@constants/apiConfig';
import { defineMessages } from 'react-intl';
import { Button, Tag } from 'antd';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime, formatMoney } from '@utils';

const message = defineMessages({
    objectName: 'Đơn hàng',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    category: 'Danh mục hệ',
});

const OrderAdminPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(paymentOptions, ['label']);
    const orderStatetateValues = translate.formatKeys(orderStateOption, ['label']);


    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.order,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => {
                return {
                    deleteItem: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(dataRow._id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined />
                            </Button>
                        );
                    },
                };
            };
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                };
            };
        },
    });

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderCode',
            align: 'center',
        },
        {
            title: 'Ngày tạo',
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
            title: 'Hình thức trả tiền',
            dataIndex: 'paymentMethod',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color} style={{ minWidth:80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ padding: '3px 0px 3px 0px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = orderStatetateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color} style={{ minWidth:125, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        mixinFuncs.renderActionColumn({ edit: true, delete: false }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'orderCode',
            placeholder: "Mã đơn hàng",
        },
        {
            key: 'userId',
            placeholder: "Mã người dùng",
        },
        {
            key: 'state',
            placeholder: "Tình trạng đơn hàng",
            type: FieldTypes.SELECT,
            options: orderStatetateValues,
        },
    ];
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.objectName) }];

    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

export default OrderAdminPage;
