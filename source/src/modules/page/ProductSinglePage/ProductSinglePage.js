/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import './ProductSinglePage.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchAsyncProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
import { formatPrice } from '../../../utils/helpers';
// import { addToCart, getCartMessageStatus, setCartMessageOff, setCartMessageOn } from '../../store/cartSlice';
// import CartMessage from '../../components/CartMessage/CartMessage';
import Loading from '@components/common/loading';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { formatMoney } from '@utils';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Button, Space, message } from 'antd';
import axios from 'axios';

const ProductSinglePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [detail, setDetail] = useState([]);
    const maxLines = 7;
    // const productId = queryParameters.get('productId');
    // const productId = useParams();

    // const product = useSelector(getProductSingle);
    // const productSingleStatus = useSelector(getSingleProductStatus);
    // const cartMessageStatus = useSelector(getCartMessageStatus);
    const [quantity, setQuantity] = useState(1);
    const {
        data: product,
        loading: allproductsLoading,
        execute: executgeallproducts,
    } = useFetch(apiConfig.product.getProductAutocomplete, {
        immediate: true,
        pathParams: { id },
        mappingData: ({ data }) => data,
    });
    useEffect(() => {
        if (product?.length > 0) setDetail(product);
        else setDetail([]);
    }, [product]);

    // getting single product
    // useEffect(() => {
    //     dispatch(fetchAsyncProductSingle(id));

    //     if (cartMessageStatus) {
    //         setTimeout(() => {
    //             dispatch(setCartMessageOff());
    //         }, 2000);
    //     }
    // }, [cartMessageStatus]);

    let discountedPrice = product?.price - product?.price * (product?.saleOff / 100);
    // if (productSingleStatus === STATUS.LOADING) {
    //     return <Loading />;
    // }

    const increaseQty = () => {
        setQuantity((prevQty) => {
            let tempQty = prevQty + 1;
            if (tempQty > product?.totalInStock) tempQty = product?.totalInStock;
            return tempQty;
        });
    };

    const decreaseQty = () => {
        setQuantity((prevQty) => {
            let tempQty = prevQty - 1;
            if (tempQty < 1) tempQty = 1;
            return tempQty;
        });
    };

    // const addToCartHandler = (product) => {
    //     let discountedPrice = product?.price - product?.price * (product?.discountPercentage / 100);
    //     let totalPrice = quantity * discountedPrice;

    //     dispatch(addToCart({ ...product, quantity: quantity, totalPrice, discountedPrice }));
    //     dispatch(setCartMessageOn(true));
    // };

    return (
        <div className="con1 py-5 bg-whitesmoke" style={{ display: 'flex', justifyContent: 'center' }}>
            <Space size={'large'} style={{ alignItems: 'center' }}>
                <div className="product-single-l">
                    <div className="product-img">
                        <div className="product-img-zoom">
                            <img
                                src={product ? (product.image ? product.image : '') : ''}
                                alt=""
                                className="img-cover"
                            />
                        </div>

                        <div className="product-img-thumbs flex align-center my-2">
                            <div className="thumb-item">
                                <img
                                    src={product ? (product.image ? product?.image : '') : ''}
                                    alt=""
                                    className="img-cover"
                                />
                            </div>
                            {product?.listProductVariant[0]?.image && (
                                <div className="thumb-item">
                                    <img
                                        src={
                                            product ? (product.image ? product?.listProductVariant[0]?.image : '') : ''
                                        }
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>
                            )}
                            {product?.listProductVariant[1]?.image && (
                                <div className="thumb-item">
                                    <img
                                        src={
                                            product ? (product.image ? product?.listProductVariant[1]?.image : '') : ''
                                        }
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>
                            )}
                            {product?.listProductVariant[2]?.image && (
                                <div className="thumb-item">
                                    <img
                                        src={
                                            product ? (product.image ? product?.listProductVariant[2]?.image : '') : ''
                                        }
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="product-single-r">
                    <div className="product-details font-manrope">
                        <div className="title fs-20 fw-5">{product?.name}</div>
                        <div>
                            <p className="para fw-3 fs-15">{product?.description}</p>
                        </div>
                        <div className="info flex align-center flex-wrap fs-14">
                            <div className="rating">
                                <span className="text-orange fw-5">Đánh giá:</span>
                                {/* <span className="mx-1">{product?.rating}</span> */}
                            </div>
                            <div className="vert-line"></div>
                            <div className="brand">
                                <span className="text-orange fw-5">Thương hiệu:</span>
                                <span className="mx-1">{product?.brandDto.name}</span>
                            </div>
                            <div className="vert-line"></div>
                            <div className="brand">
                                <span className="text-orange fw-5">Loại:</span>
                                <span className="mx-1 text-capitalize">
                                    {product?.categoryDto.name ? product?.categoryDto.name.replace('-', ' ') : ''}
                                </span>
                            </div>
                        </div>

                        <div className="price">
                            <div className="flex align-center">
                                <div className="old-price text-gray">
                                    {formatMoney(product?.price, {
                                        groupSeparator: ',',
                                        decimalSeparator: '.',
                                        currentcy: 'đ',
                                        currentcyPosition: 'BACK',
                                        currentDecimal: '0',
                                    })}
                                </div>
                                <span className="fs-14 mx-2 text-dark">Bao gồm tất cả các loại thuế</span>
                            </div>

                            <div className="flex align-center my-1">
                                <div className="new-price fw-5 font-poppins fs-24 text-orange">
                                    {formatMoney(discountedPrice, {
                                        groupSeparator: ',',
                                        decimalSeparator: '.',
                                        currentcy: 'đ',
                                        currentcyPosition: 'BACK',
                                        currentDecimal: '0',
                                    })}
                                </div>
                                <div className="discount bg-orange fs-13 text-white fw-6 font-poppins">
                                    {product?.saleOff}% OFF
                                </div>
                            </div>
                        </div>

                        <div className="qty flex align-center my-4">
                            <div className="qty-text">Quantity:</div>
                            <div className="qty-change flex align-center mx-3">
                                <button
                                    type="button"
                                    className="qty-decrease flex align-center justify-center"
                                    onClick={() => decreaseQty()}
                                >
                                    <i className="fas fa-minus"></i>
                                    <IconMinus />
                                </button>
                                <div className="qty-value flex align-center justify-center">{quantity}</div>
                                <button
                                    type="button"
                                    className="qty-increase flex align-center justify-center"
                                    onClick={() => increaseQty()}
                                >
                                    <i className="fas fa-plus"></i>
                                    <IconPlus />
                                </button>
                            </div>
                            {product?.stock === 0 ? (
                                <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                                    out of stock
                                </div>
                            ) : (
                                ''
                            )}
                        </div>

                        <div className="btns">
                            {product && <AddToCardButton item={product?.listProductVariant[0]?.id} quantity={quantity} />}
                            <button type="button" className="buy-now btn mx-3">
                                <span className="btn-text">buy now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Space>
        </div>
    );
};

const saveCartInCookie = (cartItems) => {
    // Tạo một yêu cầu POST đến endpoint của backend

};

const getAllCookies = () => {
    const cookieString = document.cookie;
    const cookies = {};

    cookieString.split('; ').forEach((cookie) => {
      const [key, value] = cookie.split('=');
      cookies[key] = value;
    });

    return cookies;
  };

function AddToCardButton({ item, quantity }) {
    console.log("Button");
    const [loading, setLoading] = useState(false);
    // console.log(cookies);
    const {
        data: addcard,
        loading: addCardLoading,
        execute: executeAddCard,
    } = useFetch(apiConfig.cart.add, {
        immediate: true,
        params: { productVariantId:item, quantity:quantity },
        mappingData: ({ data }) => data,
    });
const AddProducttoCard = () => {
    setLoading(true);
    // Lấy tất cả cookies

    // Gọi API và thêm cookie vào headers
    // executeAddCard({
    //     headers: {
    //         Cookie: allCookies,
    //     },
    // })
    executeAddCard().then((response, Headers) => {
        console.log(Headers);
        const rawCookies = response.headers ? response.headers.get('Set-cookie') : "Khong co";

        if (rawCookies) {
            // Chuyển đổi chuỗi cookies thành đối tượng cookie
            const cookies = Object.fromEntries(
                rawCookies.split('; ').map((cookie) => {
                    const [key, value] = cookie.split('=');
                    return [key, value];
                }),
            );

            // Sử dụng cookie theo cách bạn muốn
            const yourCookieValue = cookies['cart'];
            console.log(rawCookies);
        }

        if(response.result === true) {
            message.success(`Sản phẩm được thêm vào giỏ hàng thành công`);
            setLoading(false);
        }
        else {
            message.error(`Thêm sản phẩm bị lỗi`);
        }
    });
  };

    return (
        <button type="button" className="add-to-cart-btn btn">
            <i className="fas fa-shopping-cart"></i>
            <span
                className="btn-text mx-2"
                onClick={() => {
                    AddProducttoCard();
                }}
            >
                add to cart
            </span>
        </button>
    );
}

export default ProductSinglePage;
