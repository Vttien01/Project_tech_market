import React from 'react';
import { useEffect, useState } from 'react';
import { AddToCard, getAllProduct, getProductsByCategory } from '../API';
import { Badge, Button, Card, Image, List, Rate, Select, Spin, Typography, message } from 'antd';
import './Product.css';
import { useParams } from 'react-router-dom';
import CardProduct from './CardProduct';

function Products() {
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [items, setItems] = useState([]);
    const [sortProduct, setSortProduct] = useState('az');
    console.log(params);
    useEffect(() => {
        (params?.categoryId ? getProductsByCategory(params.categoryId) : getAllProduct()).then((res) => {
            setItems(res.products);
            setLoading(false);
        });
    }, [params]);

    const getSortedProduct = () => {
        const sortedItem = [...items];
        sortedItem.sort((a, b) => {
            const aLowerCaseTitle = a.title.toLowerCase();
            const bLowerCaseTitle = b.title.toLowerCase();
            if (sortProduct === 'az') {
                return aLowerCaseTitle > bLowerCaseTitle ? 1 : aLowerCaseTitle === bLowerCaseTitle ? 0 : -1;
            } else if (sortProduct === 'za') {
                return aLowerCaseTitle < bLowerCaseTitle ? 1 : aLowerCaseTitle === bLowerCaseTitle ? 0 : -1;
            } else if (sortProduct === 'lowHigh') {
                return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
            } else if (sortProduct === 'highLow') {
                return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
            }
        });
        return sortedItem;
    };

    if (loading) {
        return <Spin spinning />;
    }
    return (
        <div className="Product">
            <div style={{ marginTop: 10 }}>
                <Typography.Text>View item Sort By: </Typography.Text>
                <Select
                    onChange={(value) => {
                        setSortProduct(value);
                    }}
                    defaultValue={'az'}
                    options={[
                        {
                            label: 'Alphabetically a-z',
                            value: 'az',
                        },
                        {
                            label: 'Alphabetically z-a',
                            value: 'za',
                        },
                        {
                            label: 'Price Low to High',
                            value: 'lowHigh',
                        },
                        {
                            label: 'Price High to Low',
                            value: 'highLow',
                        },
                    ]}
                ></Select>
            </div>
            <List
                pagination={{ position: 'bottom', align: 'center' }}
                renderItem={(product, index) => <CardProduct product={product} index={index} />}
                dataSource={getSortedProduct()} // Assume getSortedProduct() returns your product data
                grid={{ column: 3 }}
            />
        </div>
    );
}

function AddToCardButton({ item }) {
    const [loading, setLoading] = useState(false);
    const AddProducttoCard = () => {
        setLoading(true);
        AddToCard(item.id).then((res) => {
            message.success(`${item.title} has been added to cart`);
            setLoading(false);
        });
    };
    return (
        <Button
            type="link"
            onClick={() => {
                AddProducttoCard();
            }}
            loading={loading}
        >
            Add to Card
        </Button>
    );
}
export default Products;
