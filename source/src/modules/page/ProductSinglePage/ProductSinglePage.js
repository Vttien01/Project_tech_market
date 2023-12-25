/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import './ProductSinglePage.scss';
import { generatePath, useParams } from 'react-router-dom';
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
import { Button, Form, Space, message } from 'antd';
import axios from 'axios';
import ListDetailsForm from './ListDetailsForm';
import useDisclosure from '@hooks/useDisclosure';
import PageWrapper from '@components/common/layout/PageWrapper';
import routes from '@routes';

const ProductSinglePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [detail, setDetail] = useState([]);
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [form] = Form.useForm();
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

    let discountedPrice;
    if (product?.saleOff) {
        discountedPrice = product?.price - product?.price * (product?.saleOff / 100);
    } else {
        discountedPrice = 0;
    }
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

    return (
        <div className="con1 py-4 bg-whitesmoke" style={{ display: 'flex', justifyContent: 'center' }}>
            <PageWrapper
                routes={[
                    {
                        breadcrumbName: 'Trang chủ',
                        path: routes.homePage.path,
                    },
                    { breadcrumbName: 'Sản phẩm' },
                ]}
                // title={title}
            >
                <ListDetailsForm
                    open={openedDetailsModal}
                    onCancel={() => handlerDetailsModal.close()}
                    form={form}
                    itemCart={product?.listProductVariant}
                    quantity={quantity}
                    saleOff={product?.saleOff !== 0 ? product?.saleOff : 0}
                    nameProduct={product?.name}
                />
                <Space size={'large'} style={{ alignItems: 'center' }}>
                    <div className="product-single-l">
                        <div className="product-img">
                            <div className="product-img-zoom">
                                <img
                                    src={product ? (product?.image ? product?.image : '') : ''}
                                    alt=""
                                    className="img-cover"
                                />
                            </div>

                            <div className="product-img-thumbs flex align-center my-2">
                                <div className="thumb-item">
                                    <img
                                        src={product ? (product?.image ? product?.image : '') : ''}
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>
                                {product?.listProductVariant[0]?.image && (
                                    <div className="thumb-item">
                                        <img
                                            src={
                                                product
                                                    ? product?.image
                                                        ? product?.listProductVariant[0]?.image
                                                        : ''
                                                    : ''
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
                                                product
                                                    ? product?.image
                                                        ? product?.listProductVariant[1]?.image
                                                        : ''
                                                    : ''
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
                                                product
                                                    ? product?.image
                                                        ? product?.listProductVariant[2]?.image
                                                        : ''
                                                    : ''
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
                            {discountedPrice !== 0 ? (
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
                            ) : (
                                <div className="price">
                                    <div className="flex align-center my-1">
                                        <div className="new-price fw-5 font-poppins fs-24 text-orange">
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
                                </div>
                            )}

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
                                {/* {product && <AddToCardButton onClick={() => AddToCardButton(product?.listProductVariant[0], quantity)} />} */}
                                <button type="button" className="add-to-cart-btn btn">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span
                                        className="btn-text mx-2"
                                        onClick={() => {
                                            handlerDetailsModal.open();
                                        }}
                                    >
                                        Thêm giỏ hàng
                                    </span>
                                </button>
                                <button type="button" className="buy-now btn mx-3">
                                    <span className="btn-text">Mua ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Space>
            </PageWrapper>
        </div>
    );
};

function AddToCardButton({ itemCart, quantity }) {
    console.log('Button');
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Lấy giỏ hàng từ localStorage khi component được render
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log(storedCart);
        setCart(storedCart);
        calculateTotal(storedCart);
    }, []);

    useEffect(() => {
        // Lưu giỏ hàng vào localStorage khi giỏ hàng thay đổi
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotal(cart);
    }, [cart]);

    const calculateTotal = (cartItems) => {
        const newTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
        setTotal(newTotal);
    };

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng lên
            const updatedCart = cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item?.quantity + product.quantity } : item,
            );
            setCart(updatedCart);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            setCart([...cart, { ...product }]);
        }
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
    };
    // console.log(cookies);
    // const {
    //     data: addcard,
    //     loading: addCardLoading,
    //     execute: executeAddCard,
    // } = useFetch(apiConfig.cart.add, {
    //     immediate: true,
    //     params: { productVariantId:item, quantity:quantity },
    //     mappingData: ({ data }) => data,
    // });
    const AddProducttoCard = () => {
        // Lấy tất cả cookies
        // Gọi API và thêm cookie vào headers
        // executeAddCard({
        //     headers: {
        //         Cookie: allCookies,
        //     },
        // })
    };

    // return (
    //     <button type="button" className="add-to-cart-btn btn">
    //         <i className="fas fa-shopping-cart"></i>
    //         <span
    //             className="btn-text mx-2"
    //             onClick={() => {
    //                 addToCart(itemCart);
    //             }}
    //         >
    //             add to cart
    //         </span>
    //     </button>
    // );
}

export default ProductSinglePage;
