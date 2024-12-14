import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useEffect, useState } from 'react';
import BaseTable from '@components/common/table/BaseTable';

import {
    DEFAULT_TABLE_ITEM_SIZE,
    isSystemSettingOptions,
    STATE_CANCELED,
    STATE_COMPLETED,
    STATE_CONFIRMED,
    STATE_PENDING,
} from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import useAuth from '@hooks/useAuth';
import SelectField from '@components/common/form/SelectField';
import { Tabs } from 'antd';
import useQueryParams from '@hooks/useQueryParams';
import routes from '@routes';
import useFetch from '@hooks/useFetch';
import { validatePermission } from '@utils';
import { commonMessage } from '@locales/intl';
import { orderStateMessage } from '@constants/masterData';
import OrderAdminPage from '.';
import { useLocation } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Đơn hàng',
});
const OrderTabPage = () => {
    const translate = useTranslate();
    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const state = queryParams.get('state');
    const { permissionCode } = useAuth();
    const [searchFilter, setSearchFilter] = useState([]);
    const [activeTab, setActiveTab] = useState(state != null ? Number(state) : STATE_PENDING);
    const { pathname: pagePath, search } = useLocation();

    const dataTab = [
        {
            label: translate.formatMessage(orderStateMessage.STATE_PENDING),
            key: STATE_PENDING,
            children: <OrderAdminPage state={activeTab} />,
            isShow: true,
        },
        {
            label: translate.formatMessage(orderStateMessage.STATE_CONFIRMED),
            key: STATE_CONFIRMED,
            children: <OrderAdminPage state={activeTab} />,
            isShow: true,
        },
        {
            label: translate.formatMessage(orderStateMessage.STATE_COMPLETED),
            key: STATE_COMPLETED,
            children: <OrderAdminPage state={activeTab} />,
            isShow: true,
        },
        {
            label: translate.formatMessage(orderStateMessage.STATE_CANCELED),
            key: STATE_CANCELED,
            children: <OrderAdminPage state={activeTab} />,
            isShow: true,
        },
    ];

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                // title={<div style={{ fontWeight: 'normal' }}>{projectName}</div>}
                baseTable={
                    <Tabs
                        style={{ marginTop: -10 }}
                        type="card"
                        onTabClick={(key) => {
                            setActiveTab(key);
                            setQueryParams({
                                state: key,
                            });
                        }}
                        activeKey={activeTab}
                        items={dataTab
                            .filter((item) => item.isShow)
                            .map((item) => {
                                return {
                                    label: item.label,
                                    key: item.key,
                                    children: item.children,
                                };
                            })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default OrderTabPage;
