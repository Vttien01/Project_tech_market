import BaseTable from '@components/common/table/BaseTable';
import { DATE_DISPLAY_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { filterLanguage, formatDateString, formatMoney, getStatusValue } from '@utils';
import { Button, ConfigProvider, Row, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { CheckOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';

import styles from './SelectProduct.module.scss';
import SelectField from '@components/common/form/SelectField';
import InputTextField from '@components/common/form/InputTextField';
import FilterForm from '@components/common/form/entry/FilterForm';
import DateFilter from '@components/common/form/entry/DateFilter';
import ListPage from '@components/common/layout/ListPage';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

function SelectProduct({ title, description, excludeIds, loading, searchParams, type = 'radio' }) {
    const translate = useTranslate();
    const [selectedRows, setSelectedRows] = useState();

    const {
        data,
        loading: getVideosLoading,
        mixinFuncs,
        pagination,
        changePagination,
    } = useListBase({
        apiConfig: apiConfig.product.getList,
        options: {
            objectName: 'Sản phẩm',
            pageSize: 5,
        },
        override: (funcs) => {
            funcs.mappingData = (response) => ({
                data: response.data.result,
                total: response.data.total,
            });

            const onDelelteItemCompleted = funcs.onDelelteItemCompleted;
            funcs.onDelelteItemCompleted = (id) => {
                onDelelteItemCompleted(id);
                setSelectedRows([]);
            };

            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    ...searchParams,
                };
            };
        },
    });

    const rowSelection = {
        preserveSelectedRowKeys: true,
        onChange: (_, selectedRows) => {
            if (type == 'radio') {
                setSelectedRows(...selectedRows);
            } else {
                setSelectedRows(selectedRows);
            }
        },
        getCheckboxProps: (record) => ({
            disabled: excludeIds?.includes(record.id),
        }),
    };

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên sản phẩm" />,
            dataIndex: ['name'],
        },
        {
            title: <FormattedMessage defaultMessage="Giá sản phẩm" />,
            dataIndex: 'price',
            width: 150,
            align: 'right',
            render: (money) => {
                const formattedValue = formatMoney(money, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentcyPosition: 'BACK',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Giảm giá" />,
            align: 'center',
            width: 130,
            dataIndex: 'saleOff',
            render: (saleOff) => {
                if (saleOff > 0) {
                    return <div>{saleOff} %</div>;
                } else return <div>{saleOff}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Đã bán" />,
            dataIndex: ['soldAmount'],
            align: 'center',
            width: 140,
        },
        {
            title: <FormattedMessage defaultMessage="Hàng tồn kho" />,
            dataIndex: ['totalInStock'],
            align: 'center',
            width: 140,
        },
    ];

    return (
        <div>
            <BaseTable
                rowSelection={{
                    type: type,
                    ...rowSelection,
                }}
                onChange={changePagination}
                pagination={pagination}
                loading={loading || getVideosLoading}
                dataSource={data}
                columns={columns}
                style={{ height: '68vh', overflowY: 'auto' }}
            />
            {/* <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#F69600',
                    },
                }}
            >
                <Row justify="end" style={{ marginTop: 20 }}>
                    <Button
                        disabled={!selectedRows}
                        icon={<CheckOutlined />}
                        type="primary"
                        style={{ padding: '0 30px' }}
                        onClick={() => console.log(selectedRows)}
                    >
                        Select
                    </Button>
                </Row>
            </ConfigProvider> */}
        </div>
    );
}

export default SelectProduct;
