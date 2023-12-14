import React from 'react';
import { Layout, Menu, Avatar, Space, Image, Input, ConfigProvider } from 'antd';
import {
    DownOutlined,
    UserOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
    ShoppingCartOutlined,
    ToolOutlined,
} from '@ant-design/icons';
const { Header } = Layout;

import styles from './AppHeader.module.scss';
import useAuth from '@hooks/useAuth';
import { useDispatch } from 'react-redux';
import { accountActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { removeCacheToken } from '@services/userService';
import { generatePath, useNavigate } from 'react-router-dom';
import { AppConstants } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import logo from '@assets/images/logoTech.png';
import routes from '@routes';
const { Search } = Input;

const messages = defineMessages({
    profile: 'Profile',
    logout: 'Logout',
    Admin: 'Admin',
});

const AppHeader = ({ collapsed, onCollapse }) => {
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const translate = useTranslate();
    const { execute: executeLogout } = useFetch(apiConfig.account.logout);

    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
        // navigate(routes.ProductHomePage1.path);
    };

    const itemHeader = () => {
        const items = [
            {
                icon: <ShoppingCartOutlined style={{ fontSize: 22 }} />,
                key: 'cart',
            },
        ];
        if (profile) {
            items.push({
                key: 'menu',
                label: (
                    <Space>
                        <Avatar
                            icon={<UserOutlined />}
                            src={`${AppConstants.contentRootUrl}${profile.logoPath || profile.avatar || profile.logo}`}
                        />
                        {profile?.careerName || profile?.leaderName || profile?.fullName || profile?.companyName}
                        <DownOutlined />
                    </Space>
                ),
                children: [
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
                    profile?.accountDto?.kind === 2 && {
                        label: (
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <ToolOutlined />
                                <span>{translate.formatMessage(messages.Admin)}</span>
                            </div>
                        ),
                        key: 'admin',
                        onClick: () => navigate('/student'),
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
            });
        } else {
            items.push({
                key: 'Log_in',
                label: <span>Đăng nhập/Đăng ký</span>,
                onClick: () => navigate(routes.loginPage.path),
            });
        }
        return items;
    };

    return (
        <Layout>
            <Header className={styles.appHeader} style={{ padding: 0, background: 'white', height: 90 }}>
                {/* <span className={styles.iconCollapse} onClick={onCollapse}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </span> */}
                <a href="" title="Tech-Market" rel="home" style={{ marginLeft: 100, marginTop: 35 }}>
                    <img width="200" height="60" src={logo} alt="Tech-market" />
                </a>
                {/* <Input.Search
                        placeholder="Bạn muốn tìm gì?"
                        size="500"
                        style={{ marginTop: 15, width: 400, alignItems: 'center', marginLeft: 150 }}
                    /> */}
                {/* <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    style={{ marginTop: 15, width: 400, alignItems: 'center', marginLeft: 150 }}
                /> */}
                <Menu mode="horizontal" className={styles.rightMenu} selectedKeys={[]} items={itemHeader()} />
            </Header>
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: '#f57e20',
                        // borderRadius: 2,

                        // Alias Token
                        // colorBgContainer: '#f57e20',
                    },
                }}
            >
                <Header className={styles.appHeader2} style={{ paddingLeft: 100, borderBottom: '1px solid #f57e20' }}>
                    <div className={styles.div_Category}>
                        <UnorderedListOutlined />
                        DANH MỤC SẢN PHẨM
                    </div>
                    <Menu
                        mode="horizontal"
                        className={styles.menu2}
                        selectedKeys={[]}
                        style={{ width: '10px' }}
                        items={[
                            {
                                label: <span className={styles.label}>TRANG CHỦ</span>,
                                key: `Home`,
                                onClick: () => navigate(routes.HomePage.path),
                            },
                            {
                                label: <span className={styles.label}>GIỚI THIỆU</span>,
                                key: `introduce`,
                                onClick: () => navigate(routes.IntroductionHome.path),
                            },
                            {
                                label: <span className={styles.label}>SẢN PHẨM</span>,
                                key: `product`,
                                onClick: () => navigate(routes.ProductHomePage1.path),
                            },
                            {
                                label: <span className={styles.label}>KINH NGHIỆM HAY</span>,
                                key: `experience`,
                                onClick: () => navigate(routes.ExperienceHome.path),
                            },
                            {
                                label: <span className={styles.label}>LIÊN HỆ</span>,
                                key: `contact`,
                                onClick: () => navigate(routes.ContactHome.path),
                            },
                        ]}
                    />
                </Header>
            </ConfigProvider>
        </Layout>
    );
};

export default AppHeader;
