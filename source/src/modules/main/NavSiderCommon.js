import React, { useMemo } from 'react';
// import './index.css';
import { LaptopOutlined, NotificationOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Icon from '@ant-design/icons/lib/components/AntdIcon';
import styles from './NavSiderCommon.module.scss';
import { generatePath, matchPath, useLocation, useNavigate } from 'react-router-dom';
import routes from '@routes';
import useValidatePermission from '@hooks/useValidatePermission';
import apiConfig from '@constants/apiConfig.js';

const { Sider } = Layout;

const navMenuConfig = [
    {
        label: (
            <div style={{ marginLeft: 10, fontSize: 16 }}>
                <UserOutlined size={20} /> Điện thoại
            </div>
        ),
        key: 'quan-ly-mon-hoc',
        children: [
            {
                label: <span>Apple</span>,
                key: 'apple',
            },
            {
                label: `Oppo`,
                key: 'oppo',
            },
            {
                label: `SamSung`,
                key: 'samsung',
            },
            {
                label: `Vivo`,
                key: 'vivo',
            },
        ],
    },
    {
        label: (
            <div style={{ marginLeft: 10, fontSize: 16 }}>
                <UserOutlined size={20} /> Laptop
            </div>
        ),
        key: 'quan-ly-du-an',
        children: [
            {
                label: `Macbook`,
                key: 'leader-management',
            },
            {
                label: `Laptop Asus`,
                key: 'developer-management',
            },

            {
                label: `Laptop Dell`,
                key: 'project-management',
            },
            {
                label: `Laptop HP`,
                key: 'project-role-management',
            },
        ],
    },
    {
        label: (
            <div style={{ marginLeft: 2, fontSize: 16 }}>
                <UserOutlined size={20} /> Tablet
            </div>
        ),
        key: 'smartphones',
    },
    {
        label: (
            <div style={{ marginLeft: 2, fontSize: 16 }}>
                <UserOutlined size={20} /> SmatchWatch
            </div>
        ),
        key: 'smatchwatch',
    },
    {
        label: (
            <div style={{ marginLeft: 2, fontSize: 16 }}>
                <UserOutlined size={20} /> Tai nghe
            </div>
        ),
        key: 'head-phone',
    },
];

const NavSiderCommon = ({ collapsed, onCollapse, width }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();
    const validatePermission = useValidatePermission();

    const onMenuClick = (item) => {
        console.log(item.key);
        navigate(`/all-product/${item.key}`);
    };

    const activeNav = useMemo(() => {
        const activeNav = findActiveNav(navMenuConfig);
        if (activeNav) {
            return activeNav;
        }

        return {
            selectedKeys: [],
            openKeys: [],
        };
    }, [location.pathname]);

    function makeNavs(navs) {
        return navs.map((nav) => {
            const newNav = { ...nav };
            if (newNav.permission || newNav.kind) {
                if (!validatePermission(newNav.permission, newNav.kind)) {
                    return null;
                }
            }

            if (newNav.children) {
                newNav.children = makeNavs(nav.children);
                if (newNav.children.every((item) => item === null)) {
                    return null;
                }
            }

            return newNav;
        });
    }

    function handleMenuItemClick(item) {
        let selectedNav;
        navMenuConfig.map((navItem) => {
            if (navItem.key === item.key) selectedNav = navItem;
            else if (navItem.children) {
                navItem.children.map((navChild) => {
                    if (navChild.key === item.key) selectedNav = navChild;
                });
            }
        });

        navigate(selectedNav?.path);
    }

    function findActiveNav(navs) {
        for (const nav of navs) {
            if (nav.children) {
                const activeItem = findActiveNav(nav.children);
                if (activeItem) {
                    return {
                        selectedKeys: activeItem.selectedKeys,
                        openKeys: [nav.key, ...activeItem.openKeys],
                    };
                }
            } else if (matchPath(nav.path + '/*', location.pathname)) {
                return {
                    selectedKeys: [nav.key],
                    openKeys: [],
                };
            }
        }

        // return defaultOpenNav;
    }

    return (
        <Sider
            style={{ background: colorBgContainer }}
            className={'app-sider ' + styles.sidebar}
            collapsible
            collapsed={collapsed}
            width={width}
            onCollapse={onCollapse}
            trigger={null}
        >
            <Menu
                style={{ borderRight: 10 }}
                className="appMenu"
                onClick={onMenuClick}
                mode="vertical"
                items={makeNavs(navMenuConfig)}
            />
            {/* <Menu
                style={{ height: '400px', borderRight: 10 }}
                // key={location.pathname == '/' ? 'initial' : 'navSider'}
                mode="vertical"
                items={makeNavs(navMenuConfig)}
                defaultSelectedKeys={activeNav.selectedKeys}
                defaultOpenKeys={activeNav.openKeys}
                // openKeys={activeNav.openKeys}
                selectedKeys={activeNav.selectedKeys}
                onSelect={(item) => handleMenuItemClick(item)
                }
            /> */}
        </Sider>
    );
};

export default NavSiderCommon;
