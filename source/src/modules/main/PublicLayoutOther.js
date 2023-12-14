import React, { useState } from 'react';
import { Layout } from 'antd';

import NavSider from './NavSider';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

import styles from './MainLayout.module.scss';
import { brandName } from '@constants';
import NavSiderCommon from './NavSiderCommon';

const { Content, Footer } = Layout;

const { Header, Sider } = Layout;

const SIDEBAR_WIDTH_EXPAND = 320;

const PublicLayoutOther = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);

    return (
        <Layout>
            <AppHeader collapsed={collapsed} onCollapse={toggleCollapsed} />
            <Layout>
                <Content>
                    <div className={styles.wrapper}>{children}</div>
                </Content>
            </Layout>
            <AppFooter />
        </Layout>
    );
};

export default PublicLayoutOther;
