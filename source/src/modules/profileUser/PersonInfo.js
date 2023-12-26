import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useSaveBase from '@hooks/useSaveBase';
import { accountActions } from '@store/actions';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Avatar, Card, Divider, Space, Statistic, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './PersonInfo.scss';
import { IconEdit, IconEditCircle } from '@tabler/icons-react';
import useListBase from '@hooks/useListBase';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useAuth from '@hooks/useAuth';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { userSateteOptions } from '@constants/masterData';

const message = defineMessages({
    objectName: 'profile',
});

const PersonInfo = () => {
    const { profile } = useAuth();
    const translate = useTranslate();
    const [detail, setDetail] = useState({});
    const { pathname: pagePath } = useLocation();
    console.log(profile);
    // const { execute, loading } = useFetch({ ...apiConfig.account.getProfile }, { immediate: false });
    // const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile);

    // useEffect(() => {
    //     execute({
    //         onCompleted: (response) => {
    //             if (response.result === true) setDetail(response.data);
    //         },
    //         onError: mixinFuncs.handleGetDetailError,
    //     });
    // }, []);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.address,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'Thông tin cá nhân',
        },
        params: {
            userId: profile.id,
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

            funcs.getCreateLink = () => {
                // return `${pagePath}/create?userId=${profile.id}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                // return `${pagePath}/${dataRow.id}?userId=${userId}`;
                // params:{},
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.Name),
            dataIndex: 'name',
            width: '150',
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
            width: '30',
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.address),
            dataIndex: 'address',
            align: 'center',
            // align: 'center',
            render: (address, dataRow) => {
                return (
                    <div>
                        {address}, {dataRow?.wardInfo.name}, {dataRow?.districtInfo.name}, {dataRow?.provinceInfo.name}
                    </div>
                );
            },
        },

        // mixinFuncs.renderStatusColumn({ width: '150px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '130px' }),
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0px' }}>
            {/* <Card  style={{ minHeight: 800, width: 400, backgroundColor: '#ffd400', marginRight:0 }}></Card>
            <Card  style={{ minHeight: 800, width: 400, backgroundColor: '#ffd400', marginLeft:0 }}></Card> */}
            <Space className="rounded-square-left" direction="vertical">
                <Avatar size={200} icon={<UserOutlined />} />
                <Typography.Title level={6}>Người dùng</Typography.Title>
                <Typography.Title level={4}>{profile?.username}</Typography.Title>
                <IconEdit size={40} color="#282a36" />
            </Space>
            <Space className="rounded-square-right" direction="vertical">
                <div className="box-with-border">
                    <Divider orientation="left" style={{ fontSize: 30 }}>
                        Thông tin cá nhân
                    </Divider>
                </div>
                <Space direction="horizontal">
                    <DashboardCard title={'Họ và tên'} value={profile?.fullName} />
                    <DashboardCard title={'Email'} value={profile?.email} />
                </Space>
                <Space direction="horizontal">
                    <DashboardCard title={'Số điện thoại'} value={profile?.phone} />
                    <DashboardCardStatus title={'Trạng thái hoạt động'} value={profile?.status} />
                </Space>
                <Divider orientation="left" style={{ fontSize: 30 }}>
                    Thông tin địa chỉ
                </Divider>
                <ListPage
                    actionBar={mixinFuncs.renderActionBar()}
                    style={{ backgroundColor: '#fcd8bc', borderRadius: '0px' }}
                    baseTable={
                        <BaseTable
                            onChange={mixinFuncs.changePagination}
                            columns={columns}
                            dataSource={data}
                            loading={loading}
                            pagination={pagination}
                        />
                    }
                />
            </Space>
        </div>
    );
};

function DashboardCard({ title, value, icon, icon1, number }) {
    return (
        <Card style={{ minWidth: 350, backgroundColor: '#e7e7e7' }}>
            <Space direction="vertical">
                <Typography.Title level={5}>{title}</Typography.Title>
                <Typography.Text>{value}</Typography.Text>
            </Space>
        </Card>
    );
}

function DashboardCardStatus({ title, value, icon, icon1, number }) {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(userSateteOptions, ['label']);
    const state = stateValues.find((item) => item.value == value);
    return (
        <Card style={{ minWidth: 350, backgroundColor: '#e7e7e7' }}>
            <Space direction="vertical">
                <Typography.Title level={5}>{title}</Typography.Title>
                <Tag
                    color={state.color}
                    style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div style={{ padding: '0 0px', fontSize: 14 }}>{state.label}</div>
                </Tag>
            </Space>
        </Card>
    );
}

export default PersonInfo;
