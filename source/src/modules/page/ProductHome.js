import React, { useState } from 'react';
import NavSiderCommon from '@modules/main/NavSiderCommon';
import Products from './Components/Product';
import { Route, Routes } from 'react-router-dom';
import styles from '../main/MainLayout.module.scss';
import { useEffect } from 'react';
import { AddToCard, getAllProduct, getProductsByCategory } from './Components/API';
import { Badge, Button, Card, Image, List, Rate, Select, Spin, Typography, message } from 'antd';
import './Product.css';
import { useParams } from 'react-router-dom';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';

const ProductHome = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);

    return (
        <div style={{ align: 'start', display: 'flex', flex: 1 }}>
            <div className={styles.siderHeader}>
                <NavSiderCommon collapsed={collapsed} onCollapse={toggleCollapsed} />
            </div>
            <div>
                <Routes>
                    <Route path="/" element={<Products />}></Route>
                    <Route path="/:categoryId" element={<Products />}></Route>
                </Routes>
            </div>
        </div>
    );
};

export default ProductHome;
