import React from 'react';
import { UsergroupAddOutlined, ControlOutlined, InboxOutlined } from '@ant-design/icons';
import routes from '@routes';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';
import product from "@assets/icons/building-factory.svg";
import news from "@assets/icons/news.svg";


export const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="User management" />,
        key: 'user-management',
        icon: <UsergroupAddOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Admins" />,
                key: 'admin',
                path: routes.adminsListPage.path,
                permission: [apiConfig.account.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Users" />,
                key: 'user',
                path: routes.userListPage.path,
                permission: [apiConfig.user.getList.baseURL],
            },
            // {
            //     label: <FormattedMessage  defaultMessage='Admins Leader'/>,
            //     key: 'admin-leader',
            //     path: routes.adminsLeaderListPage.path,
            //     permission: [apiConfig.user.getList.baseURL],
            // },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý Sản phẩm" />,
        key: 'product-management',
        icon: <img src={product} alt="My SVG" />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Thương hiệu" />,
                key: 'brand',
                path: routes.brandListPage.path,
                permission: [apiConfig.brand.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Sản phẩm" />,
                key: 'product',
                path: routes.productListPage.path,
                permission: [apiConfig.product.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Loại" />,
                key: 'news-category',
                path: routes.newsCategoryListPage.path,
                permission: [apiConfig.category.getList.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="News management" />,
        key: 'news-management',
        icon: <img src={news} alt="My SVG" />,
        children: [
            {
                label: <FormattedMessage defaultMessage="News" />,
                key: 'news-list',
                path: routes.newsListPage.path,
                // permission: [apiConfig.news.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="News category" />,
                key: 'news-category',
                path: routes.newsCategoryListPage.path,
                permission: [apiConfig.category.getList.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý đơn hàng" />,
        key: 'order-management',
        icon: <UsergroupAddOutlined />,
        children: [],
    },
    {
        label: <FormattedMessage defaultMessage="Systems" />,
        key: 'system-management',
        icon: <ControlOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Role" />,
                key: 'role',
                path: routes.groupPermissionPage.path,
                permission: [apiConfig.groupPermission.getGroupList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="List Setting" />,
                key: 'list-setting',
                path: routes.listSettingsPage.path,
                permission: [apiConfig.settings.getSettingsList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Nation" />,
                key: 'nation',
                path: routes.nationListPage.path,
                permission: [apiConfig.nation.getList.baseURL],
            },
        ],
    },
];

export default navMenuConfig;

