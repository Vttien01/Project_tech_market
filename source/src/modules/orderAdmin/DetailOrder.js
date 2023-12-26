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
import AvatarField from '@components/common/form/AvatarField';
import routes from '@routes';

const message = defineMessages({
    objectName: 'Chi tiết đơn hàng',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    category: 'Danh mục hệ',
});

const DetailOrder = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);

    const orderId = queryParameters.get('orderId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(paymentOptions, ['label']);
    const orderStatetateValues = translate.formatKeys(orderStateOption, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, serializeParams, serializeParam } =
        useListBase({
            apiConfig: {
                getList: apiConfig.orderDetail.getByOrder,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };
                // const prepareGetListParams = funcs.prepareGetListParams;
                // funcs.prepareGetListParams = (params) => {
                //     return {
                //         ...prepareGetListParams(params),
                //     };
                // };
                funcs.prepareGetListPathParams = () => {
                    return {
                        id: orderId,
                    };
                };
                // funcs.changeFilter = (filter) => {
                //     mixinFuncs.setQueryParams(
                //         serializeParam({
                //             id:orderId,
                //             ...filter,
                //         }),
                //     );
                // };
                // funcs.getList = () => {
                //     const params = mixinFuncs.prepareGetListPathParams(queryFilter);
                //     mixinFuncs.handleFetchList({ ...params });
                // };
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, orderId: null });
                };
            },
        });
    console.log(data);

    const columns = [
        {
            title: '#',
            dataIndex: 'image',
            align: 'center',
            width: 40,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? avatar : null}
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: 'Màu',
            dataIndex: 'color',
            align: 'center',
            // render: (createdDate) => {
            //     const result = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
            //     return <div>{result}</div>;
            // },
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            align: 'center',
        },
        {
            title: 'Đơn giá',
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
        // mixinFuncs.renderStatusColumn({ width: '120px' }),
        // mixinFuncs.renderActionColumn({ edit: true, delete: false }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: 'Tên sản phẩm',
        },
    ];
    const breadRoutes = [
        { breadcrumbName: "Đơn hàng", path:routes.OrderPageAdmin.path },
        { breadcrumbName: translate.formatMessage(message.objectName) },
    ];

    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                // actionBar={mixinFuncs.renderActionBar()}
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

export default DetailOrder;
