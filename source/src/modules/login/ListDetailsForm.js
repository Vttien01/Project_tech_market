import { BaseForm } from '@components/common/form/BaseForm';
import InputTextField from '@components/common/form/InputTextField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Card, Col, Form, Input, Modal, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    otpFail: 'Nhập mã OTP thất bại!!',
    login: 'Đăng nhập',
});

const ListDetailsForm = ({ handleAddList, open, onCancel, data, isEditing, form, handleEditItemList }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const navigate = useNavigate();
    const [idHash, setidHash] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { execute: executeRequestForgetPassword, loading: loadingRequestForgetPassword } = useFetch({
        ...apiConfig.account.requestForgetPassword,
    });
    const { execute: executeForgetPassword, loading: loadingForgetPassword } = useFetch({
        ...apiConfig.account.forgetpasswordAccount,
    });

    useEffect(() => {
        if (data) form.setFieldsValue({ ...data });
    }, [data]);
    const handleFinish = (values) => {
        let data;
        data = { newPassword: values.newPassword, otp: values.otp, idHash: idHash };
        executeForgetPassword({
            data: { ...data },
            onCompleted: (response) => {
                // setCacheAccessToken(res.access_token);
                // executeGetProfile();
                showSucsessMessage(response.message);
                // navigate('/login');
                form.resetFields();
                onCancel();
            },
            onError: (error) => {
                showErrorMessage(error.message);
                form.resetFields();
            },
        });
    };
    const onChange = (id, item) => {
        form.setFieldValue('projectRoleId', item);
    };
    const [secondsLeft, setSecondsLeft] = useState();
    const [isCounting, setIsCounting] = useState(false);

    const handleGetOtp = () => {
        // Xử lý sự kiện khi người dùng click vào "Quên mật khẩu?"
        const email = form.getFieldValue('email');
        let data;
        data = { email: email };
        executeRequestForgetPassword({
            data: { ...data },
            onCompleted: (response) => {
                setidHash(response.data.idHash);
                showSucsessMessage(response.message);
                // form.resetFields();
            },
            onError: (error) => {
                showErrorMessage('Check your email!');
                // form.resetFields();
            },
        });
        setIsCounting(!isCounting);
    };

    useEffect(() => {
        let timer;
        // if (isCounting) {
        timer = setInterval(() => {
            setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);
        // }

        return () => {
            clearInterval(timer);
        };
        // console.log(isCounting);
    }, [isCounting]);

    const formattedTime = `${Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;
    return (
        <Modal
            title={<FormattedMessage defaultMessage="Đặt lại mật khẩu" />}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <BaseForm form={form} onFinish={handleFinish} size="100%">
                <Card>
                    <Row gutter={24}>
                        <Col span={24}>
                            <InputTextField
                                label={<FormattedMessage defaultMessage="Email" />}
                                name="email"
                                type="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Định dạng email không hợp lệ',
                                    },
                                ]}
                                required
                            />
                        </Col>
                        <Col span={24}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Mật khẩu" />}
                                name="newPassword"
                                type="password"
                                rules={[
                                    {
                                        validator: async () => {
                                            const isTouched = form.isFieldTouched('password');
                                            if (isTouched) {
                                                const value = form.getFieldValue('password');
                                                if (value.length < 6) {
                                                    throw new Error(
                                                        translate.formatMessage(commonMessage.validatePassword),
                                                    );
                                                }
                                            }
                                        },
                                    },
                                ]}
                                required
                            />
                        </Col>
                        <Col span={24}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Xác nhận mật khẩu" />}
                                name="confirmPassword"
                                type="password"
                                rules={[
                                    {
                                        validator: async () => {
                                            const password = form.getFieldValue('newPassword');
                                            const confirmPassword = form.getFieldValue('confirmPassword');
                                            console.log(password);
                                            if (password !== confirmPassword) {
                                                throw new Error(
                                                    translate.formatMessage(commonMessage.passwordNotMatch),
                                                );
                                            }
                                        },
                                    },
                                ]}
                                // required
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <InputTextField
                                name="otp"
                                placeholder="OTP"
                                required
                            />
                        </Col>
                        <Col span={12}>
                            {secondsLeft > 1 ? (
                                <Button><Statistic value={formattedTime} valueStyle={{ fontSize: 15, fontWeight: 500 }} /></Button>
                            ) : (
                                <Button
                                    onClick={(e) => {
                                        setSecondsLeft(40);
                                        e.stopPropagation();
                                        handleGetOtp();
                                    }}
                                >
                                    {/* {secondsLeft > 0 ? 'Lấy mã' : 'Gửi lại mã'} */}
                                    Lấy mã
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default ListDetailsForm;
