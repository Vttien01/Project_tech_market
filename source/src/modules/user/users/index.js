import { HomeOutlined, LoadingOutlined, RiseOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { kindUseVoucherOptions, userSateteOptions } from '@constants/masterData';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { showInforMessage, showWarningMessage } from '@services/notifyService';
import { convertUtcToLocalTime, formatMoney } from '@utils/index';
import { Button, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalChart from './ModalChart';

const UserListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    // const { isCustomer } = useAuth();
    const [openChartModal, handlersChartModal] = useDisclosure(false);
    const stateValues = translate.formatKeys(userSateteOptions, ['label']);
    const { execute: executeGetList, loading: loadingGetListOrder } = useFetch(apiConfig.order.getList, {
        immediate: false,
    });
    const [dataHistoryOrder, setDataHistoryOrder] = useState(null);
    const [itemUser, setItemUser] = useState(null);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.user,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
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
            funcs.additionalActionColumnButtons = () => ({
                address: ({ id }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.address)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.userListPage.path + `/address?userId=${id}`, {
                                    state: { action: 'taskLog', prevPath: location.pathname },
                                });
                            }}
                        >
                            <HomeOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                chart: (dataRow) => {
                    return (
                        <Tooltip title={'Tiến trình tăng trưởng'} placement="bottom">
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCLick(dataRow);
                                }}
                                style={{ padding: 0 }}
                                key={dataRow.id}
                            >
                                <RiseOutlined key={dataRow.id} />
                            </Button>
                        </Tooltip>
                    );
                },
            });
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: ['account', 'avatar'],
            align: 'center',
            width: 100,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: translate.formatMessage(commonMessage.fullName), dataIndex: ['account', 'fullName'] },
        { title: translate.formatMessage(commonMessage.phone), dataIndex: ['account', 'phone'], width: '130px' },
        { title: translate.formatMessage(commonMessage.email), dataIndex: ['account', 'email'] },
        {
            title: translate.formatMessage(commonMessage.birthday),
            dataIndex: 'birthday',
            render: (birthday) => {
                const result = convertUtcToLocalTime(birthday, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                return <div>{result}</div>;
            },
            width: '180px',
        },
        {
            title: 'Loại tài khản',
            // dataIndex: 'memberShip',
            align: 'center',
            width: 180,
            render: (dataRow) => {
                const kind = kindUseVoucherOptions.find((item) => item.value == dataRow?.memberShip);
                const money = dataRow?.totalSpent
                    ? formatMoney(dataRow?.totalSpent, {
                        groupSeparator: ',',
                        decimalSeparator: '.',
                        currentcy: 'đ',
                        currentcyPosition: 'BACK',
                        currentDecimal: '0',
                    })
                    : '0đ';
                return kind ? (
                    <Tooltip title={`Tổng chi tiêu ${money}`} placement="bottom">
                        <Tag color={kind.color} style={{ width: 'max-content', textAlign: 'center' }}>
                            <div style={{ fontSize: 14 }}>{kind.label}</div>
                        </Tag>
                    </Tooltip>
                ) : (
                    <Tag />
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: ['account', 'status'],
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag
                        color={state.color}
                        style={{ minWidth: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{ padding: '0 0px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        // {
        //     title: translate.formatMessage(commonMessage.createdDate),
        //     dataIndex: 'createdDate',
        //     width: '180px',
        //     render: (createdDate) => convertUtcToTimezone(createdDate),
        // },
        // mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn({ chart: true, address: true, edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(commonMessage.fullName),
        },
        {
            key: 'email',
            placeholder: translate.formatMessage(commonMessage.email),
        },
        {
            key: 'phone',
            placeholder: translate.formatMessage(commonMessage.phone),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
    ];

    const handleCLick = (record) => {
        executeGetList({
            params: {
                state: 4,
                userId: record.id,
            },
            onCompleted: (res) => {
                if (res.data.content?.length > 0) {
                    setDataHistoryOrder(res.data.content);
                    setItemUser(record);
                    handlersChartModal.open();
                } else showInforMessage('Người dùng này chưa có đơn hàng nào');
            },
        });
    };

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading || loadingGetListOrder}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            />
            <ModalChart
                open={openChartModal}
                onCancel={() => {
                    setDataHistoryOrder(null);
                    handlersChartModal.close();
                }}
                width={800}
                dataHistoryOrder={dataHistoryOrder}
                itemUser={itemUser}
            />
        </PageWrapper>
    );
};

export default UserListPage;
