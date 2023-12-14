/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Layout, Menu, Avatar, Space } from 'antd';
import {
    DownOutlined,
    UserOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TranslationOutlined,
    HomeOutlined,
} from '@ant-design/icons';
const { Header } = Layout;

import styles from './AppHeader.module.scss';
import useAuth from '@hooks/useAuth';
import { useDispatch } from 'react-redux';
import { accountActions, appActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { removeCacheToken } from '@services/userService';
import { useNavigate } from 'react-router-dom';
import { AppConstants } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import useLocale from '@hooks/useLocale';
import routes from '@routes';

const messages = defineMessages({
    profile: 'Profile',
    logout: 'Logout',
    locale: '{locale, select, en {Vietnamese} other {English}}',
    home: 'Home',
});

const AppHeader = ({ collapsed, onCollapse }) => {
    const { locale } = useLocale();
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { execute: executeLogout } = useFetch(apiConfig.account.logout);
    const translate = useTranslate();

    const handleChangeLocale = () => {
        dispatch(appActions.changeLanguage(locale === 'vi' ? 'en' : 'vi'));
    };

    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
        navigate(routes.loginPage.path);
    };

    return (
        <Header className={styles.appHeader} style={{ padding: 0, background: 'white' }}>
            <span className={styles.iconCollapse} onClick={onCollapse}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Menu
                mode="horizontal"
                className={styles.rightMenu}
                selectedKeys={[]}
                items={[
                    {
                        key: 'menu',
                        label: (
                            <Space>
                                <Avatar
                                    icon={<UserOutlined />}
                                    src={`${AppConstants.contentRootUrl}${
                                        profile.logoPath || profile.avatar || profile.logo
                                    }`}
                                />
                                {profile?.careerName ||
                                    profile?.leaderName ||
                                    profile?.fullName ||
                                    profile?.companyName}
                                <DownOutlined />
                            </Space>
                        ),
                        children: [
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <HomeOutlined />
                                        <span>{translate.formatMessage(messages.home)}</span>
                                    </div>
                                ),
                                key: 'profile',
                                onClick: () => navigate('/all-product'),
                            },
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <UserOutlined />
                                        <span>{translate.formatMessage(messages.profile)}</span>
                                    </div>
                                ),
                                key: 'profile',
                                onClick: () => navigate('/profile'),
                            },
                            {
                                // label: translate.formatMessage(messages.locale, { locale }),
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <TranslationOutlined />
                                        <span>{translate.formatMessage(messages.locale, { locale })}</span>
                                    </div>
                                ),
                                key: 'locale',
                                // icon: <TranslationOutlined />,
                                onClick: handleChangeLocale,
                            },
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <LoginOutlined />
                                        <span>{translate.formatMessage(messages.logout)}</span>
                                    </div>
                                ),
                                key: 'logout',
                                onClick: onLogout,
                            },
                        ],
                    },
                ]}
            />
        </Header>
    );
};

export default AppHeader;
