import React, { useEffect, useState } from 'react';
import NavSiderCommon from '@modules/main/NavSiderCommon';
import styles from '../main/MainLayout.module.scss';
import './home.css';
import { Carousel, Row, Col, Image, Radio, Flex, List, Card } from 'antd';
import { Button, Space } from 'antd';
import banner1 from '@assets/images/HomePage/banner1.jpg';
import banner2 from '@assets/images/HomePage/banner2.jpg';
import banner3 from '@assets/images/HomePage/banner3.jpg';
import banner4 from '@assets/images/HomePage/banner4.jpg';
import banner5 from '@assets/images/HomePage/slider-banner1.jpg';
import banner6 from '@assets/images/HomePage/slider-banner2.jpg';
import banner7 from '@assets/images/HomePage/slider-banner3.jpg';
import { useParams } from 'react-router-dom';
const positionOptions = ['top', 'bottom', 'both'];
import { AddToCard, getAllProduct, getProductsByCategory } from './Components/API/index';


window.onload = function () {};

const HomePage = () => {
    const [position, setPosition] = useState(' ');
    const contentStyle = {
        height: '250px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        marginTop: 1,
        marginBottom: 0,
    };

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);
    const params = "all-product";
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (params?.categoryId ? getProductsByCategory(params.categoryId) : getAllProduct()).then((res) => {
            setItems(res.products);
            setLoading(false);
        });
    }, [params]);

    return (
        <div className="container">
            <div className="siderHome">
                <NavSiderCommon collapsed={collapsed} onCollapse={toggleCollapsed} />
            </div>
            <div className="BannerHome">
                <Row justify="space-around" align="middle" style={{ paddingTop: 0 }}>
                    <Col span={17}>
                        <Carousel autoplay>
                            <div>
                                <Image src={banner2} />
                            </div>
                            <div>
                                <Image src={banner3} />
                            </div>
                            <div>
                                <Image src={banner4} />
                            </div>
                        </Carousel>
                        <Space>
                            <Image src={banner5} style={{ height: '200px' }} />
                            <Image src={banner6} style={{ height: '200px' }} />
                        </Space>
                    </Col>
                    <Col span={7}>
                        <Image src={banner7} />
                    </Col>
                </Row>
            </div>
            <div className="contentFlask">
                <Space
                    direction="horizontal"
                    style={{
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center', // Adjust as needed
                    }}
                    size="middle"
                >
                    <span style={{ fontSize: 40, marginLeft: 10 }}>TREND</span>
                    <Space size={[4, 16]} wrap>
                        {new Array(4).fill(null).map((_, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Button key={index}>Button</Button>
                        ))}
                    </Space>
                </Space>
                <List
                    grid={{
                        gutter: 16,
                        column: 4,
                    }}
                    dataSource={items}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.title}>Card content</Card>
                        </List.Item>
                    )}
                />
            </div>
            <div className="contentTrend"></div>
            <div className="contentProduct"></div>
            <div className="contentProudctBonus"></div>
        </div>
    );
};

export default HomePage;
