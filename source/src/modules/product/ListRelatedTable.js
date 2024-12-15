import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import BaseTable from '@components/common/table/BaseTable';
import useTranslate from '@hooks/useTranslate';
import { formatMoney } from '@utils';
import { Button, Divider } from 'antd';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Sản phẩm liên quan',
});
const ListRelatedTable = ({ data, loading, handleDeleteRelatedList }) => {
    const translate = useTranslate();
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
        {
            title: <FormattedMessage defaultMessage="Hành động" />,
            align: 'center',
            width: '90px',
            render: (index) => {
                return (
                    <>
                        <BaseTooltip type="delete" objectName={translate.formatMessage(messages.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRelatedList(index.id);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: 'red' }} />
                            </Button>
                        </BaseTooltip>
                    </>
                );
            },
        },
    ];
    return <BaseTable rowKey={(record) => record.index} columns={columns} dataSource={data} loading={loading} />;
};

export default ListRelatedTable;
