import { BaseForm } from '@components/common/form/BaseForm';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { formatMoney } from '@utils';
import { Button, Card, Col, Flex, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const RelatedModal = ({
    listProduct,
    loading,
    handleDeleteList,
    onCancel,
    form,
    open,
    excludeIds = [],
    setSelectedRowIds,
    setSelectedRows,
    setIsChangedFormValues,
}) => {
    const translate = useTranslate();
    const [active, setActive] = useState(false);
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
    const rowSelection = {
        preserveSelectedRowKeys: true,
        onChange: (_selectedRowIds, selectedRows) => {
            setIsChangedFormValues(true);
            setActive(true);
            setSelectedRowIds((prevSelectedRowIds) => {
                const newSelectedRows = _selectedRowIds.filter(
                    (row) => !prevSelectedRowIds.some((prevRow) => prevRow === row),
                );
                return [...prevSelectedRowIds, ...newSelectedRows];
            });
            setSelectedRows((prevSelectedRows) => {
                const newSelectedRows = selectedRows.filter(
                    (row) => !prevSelectedRows.some((prevRow) => prevRow.id === row.id),
                );
                return [...prevSelectedRows, ...newSelectedRows];
            });
        },
        getCheckboxProps: (record) => ({
            disabled: excludeIds?.includes(record.id),
        }),
    };
    return (
        <Modal
            title={<FormattedMessage defaultMessage="Danh sách yêu cầu" />}
            open={open}
            onCancel={onCancel}
            // onOk={() => onCancel()}
            width={'70vw'}
            styles={{
                content: {
                    height: '80vh',
                },
            }}
            footer={
                <Flex justify="end" gap={8} style={{ marginTop: 8 }}>
                    <Button
                        size="larger"
                        onClick={() => {
                            setActive(false);
                            onCancel();
                        }}
                    >
                        Đóng
                    </Button>
                    <Button
                        type="primary"
                        size="larger"
                        disabled={!active}
                        onClick={() => {
                            setActive(false);
                            onCancel();
                        }}
                    >
                        Thêm
                    </Button>
                </Flex>
            }
        >
            <BaseTable
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={listProduct}
                loading={loading}
                style={{ height: '68vh', overflowY: 'auto' }}
                onRow={(record) => ({
                    onClick: () => {
                        // Check if the row is already selected
                        // const isSelected = selectedRows.some((row) => row.id === record.id);
                        // let updatedSelectedRows;
                        // if (isSelected) {
                        //     updatedSelectedRows = selectedRows.filter((row) => row.id !== record.id);
                        // } else {
                        //     updatedSelectedRows = [...selectedRows, record];
                        // }
                        // setSelectedRows(updatedSelectedRows);
                    },
                })}
            />
        </Modal>
    );
};

export default RelatedModal;
