import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { IconPlus, IconRecycle, IconTrash } from '@tabler/icons-react';
import { IconMinus } from '@tabler/icons-react';
import { formatMoney } from '@utils';
import { Avatar, Button, Card, Col, Form, InputNumber, List, Modal, Row, Table, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import VirtualList from 'rc-virtual-list';

const messages = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
});

const ListDetailsForm = ({ open, onCancel, detail, form, isEditing, orderId }) => {
    const { profile } = useAuth();
    const [cartItem, setCartItem] = useState([]);
    const [checkList, setCheckArray] = useState(false);
    const [skipFirstSubmit, setSkipFirstSubmit] = useState(true);
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpdate } = useFetch(apiConfig.address.update);
    const { execute: createTransaction, loading } = useFetch({
        ...apiConfig.transaction.create,
    });
    const [tableData, setTableData] = useState([]);

    console.log(detail);

    // Kiểm tra xem itemCart có tồn tại không trước khi sử dụng map
    const [newArray, setnewArray] = useState([]);
    const [newArray1, setnewArray1] = useState([]);

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);

    const onChange = (id, item) => {
        form.setFieldValue('provinceId', item);
    };

    useEffect(() => {
        if (province !== null) {
            setDistrict(null);
        }
    }, [province]);

    useEffect(() => {
        if (skipFirstSubmit) {
            setSkipFirstSubmit(false);
            return;
        }
        setnewArray((prevArray) => prevArray.filter((item) => item.quantity !== 0));
        setCheckArray(false);
    }, [checkList]);
    const handleFinish = () => {
        createTransaction({
            data: {
                orderId: orderId,
                urlCancel: 'http://localhost:3000/my-order-fail',
                urlSuccess: 'http://localhost:3000/my-order-success',
            },
            onCompleted: (res) => {
                window.location.href = res.data;
                showSucsessMessage('Đơn hàng đang được xử lý!');
            },
            onError: () => {
                showErrorMessage("Thanh toán PAYPAL thất bại");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            },
        });
    };

    return (
        <Modal
            title={<FormattedMessage defaultMessage="Chi tiết đơn hàng" />}
            open={open}
            onCancel={onCancel}
            onOk={handleFinish}
            width={700}
            okText="Tiến hành thanh toán"
        >
            <Card>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={detail.content}
                    style={{ marginBottom:10 }}
                    renderItem={(item) => (
                        <Card style={{ backgroundColor: '#eff0f1', marginTop: 10 }}>
                            <List.Item key={item?.id}>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={item?.image}
                                            size={100}
                                            alt=''
                                        />
                                    }
                                    title={<a href="https://ant.design"  style={{ fontSize:25 }}>{item?.name}</a>}
                                    // description={item?.price}
                                    description={
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div style={{ flex: '1', justifyContent: 'center' }}>Số lượng: {item.amount}</div>
                                            <div style={{ flex: '1', justifyContent: 'center' }}>Màu: {item.color}</div>
                                            <div style={{ flex: '1', justifyContent: 'center', fontSize:20 }}> Tổng tiền: { " " }
                                                {formatMoney(item?.price, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </div>
                                        </div>
                                    }
                                />
                                {/* <div>
                                    <IconTrash color='#f32020'/>
                                </div> */}
                            </List.Item>
                        </Card>
                    )}
                />
            </Card>
        </Modal>
    );
};

export default ListDetailsForm;
