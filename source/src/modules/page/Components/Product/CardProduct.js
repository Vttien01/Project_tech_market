// CardProduct.js
import React from 'react';
import { Badge, Card, Typography, Image } from 'antd';

const CardProduct = ({ product, index }) => {
    return (
        <Badge.Ribbon text={`${product.discountPercentage}% Off`} className="itemCardBadge" color="red">
            <Card
                className="itemCard"
                title={product.title}
                key={index}
                cover={<Image src={product.thumbnail} className="itemCardImage" />}
                actions={
                    [
                        // <Rate allowHalf disabled value={product.rating} />,
                        // <AddToCardButton item={product} />,
                    ]
                }
            >
                <Card.Meta
                    title={
                        <Typography.Paragraph>
                            Price: ${product.price}{' '}
                            <Typography.Text delete type="danger">
                                {parseFloat(product.price + (product.price * product.discountPercentage) / 100).toFixed(
                                    2,
                                )}
                            </Typography.Text>
                        </Typography.Paragraph>
                    }
                    description={
                        <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                            {product.description}
                        </Typography.Paragraph>
                    }
                />
            </Card>
        </Badge.Ribbon>
    );
};

export default CardProduct;
