import { DeleteOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { kindUseVoucherOptions, statusOptions, statusVoucherOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { render } from '@testing-library/react';
import { formatDateString, formatDateToZeroTime } from '@utils';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    objectName: 'Voucher',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    category: 'Danh mục hệ',
    amount: 'Số lượng',
    expired: 'Ngày hết hạn',
    expiredSpace: 'Thời hạn còn lại',
    percent: 'Phần trăm giảm',
});

const VoucherListPage = () => {
    const translate = useTranslate();
    // const statusVoucherValues = translate.formatKeys(statusVoucherOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.voucher,
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
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.expired == null) {
                    delete values.expired;
                    handleFilterSearchChange({
                        ...values,
                    });
                } else {
                    const expired = values.expired && formatDateString(values.expired, DATE_FORMAT_DISPLAY);
                    handleFilterSearchChange({
                        ...values,
                        expired: expired,
                    });
                }
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'title',
        },
        {
            title: translate.formatMessage(message.amount),
            dataIndex: 'amount',
            align: 'center',
            render: (dataRow) => <div>{dataRow || 0}</div>,
        },
        {
            title: translate.formatMessage(message.percent),
            dataIndex: 'percent',
            align: 'center',
            width: 180,
            render: (dataRow) => <div>{dataRow}%</div>,
        },
        {
            title: translate.formatMessage(message.expired),
            dataIndex: 'expired',
            align: 'center',
            width: 180,
        },
        {
            title: translate.formatMessage(message.expiredSpace),
            dataIndex: 'expired',
            align: 'center',
            width: 180,
            render: (dataRow) => {
                const date1 = dayjs(dataRow, DEFAULT_FORMAT); // Ngày hết hạn
                const date2 = dayjs();
                const daysDifference = date2.isBefore(date1) ? date1.diff(date2, 'day') : 0;
                return daysDifference > 0 ? <span>{daysDifference} ngày</span> : <Tag color="red">Hết hạn</Tag>;
            },
        },
        {
            title: 'Loại tài khản',
            dataIndex: 'kind',
            align: 'center',
            width: 180,
            render: (dataRow) => {
                const kind = kindUseVoucherOptions.find((item) => item.value == dataRow);
                return (
                    <Tag color={kind.color} style={{ width: 'max-content', textAlign: 'center' }}>
                        <div style={{ fontSize: 14 }}>{kind.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'status',
            align: 'center',
            width: 'max-content',
            render: (dataRow) => {
                const status = statusVoucherOptions.find((item) => item.value == dataRow);
                return (
                    <Tag color={status.color} style={{ width: 'max-content', textAlign: 'center' }}>
                        <div style={{ fontSize: 14 }}>{status.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'title',
            placeholder: translate.formatMessage(message.name),
        },
        {
            key: 'expired',
            placeholder: 'Ngày hết hạn',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            submitOnChanged: true,
        },
        {
            key: 'kind',
            placeholder: 'Loại tài khản',
            type: FieldTypes.SELECT,
            options: kindUseVoucherOptions,
            submitOnChanged: true,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusVoucherOptions,
            submitOnChanged: true,
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

export default VoucherListPage;
