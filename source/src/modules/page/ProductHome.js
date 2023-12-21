import React, { useState } from 'react';
import NavSiderCommon from '@modules/main/NavSiderCommon';
import Products from './Components/Product';
import { Route, Routes, generatePath } from 'react-router-dom';
import styles from '../main/MainLayout.module.scss';
import './Product.css';
import PageWrapper from '@components/common/layout/PageWrapper';
import routes from '@routes';

const ProductHome = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState([]);
    const queryParameters = new URLSearchParams(window.location.search);
    const category = queryParameters.get('category');

    const toggleCollapsed = () => setCollapsed((prev) => !prev);

    return (
        <div style={{ justifyContent: 'center', display:'flex' }}>
            <div>
                <NavSiderCommon collapsed={collapsed} onCollapse={toggleCollapsed} />
            </div>
            <div>{category ? <Products title={category} /> : <Products />}</div>
            {/* <div>
                <Routes>
                    <Route path="/" element={<Products/>}></Route>
                    <Route path="/:categoryId" element={<Products />}></Route>
                </Routes>
            </div> */}
        </div>
    );
};

export default ProductHome;
