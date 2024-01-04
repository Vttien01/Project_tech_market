import { BaseForm } from '@components/common/form/BaseForm';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage } from '@services/notifyService';
import { Alert, Button, Card, Col, Form, Input, Modal, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
});

const ListDetailsForm = ({ open, onCancel, data, form, idHash, email }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { execute, loading } = useFetch({
        ...apiConfig.user.forgetPassword,
    });
    const { execute: executeRequestForgetPassword, loading: loadingRequestForgetPassword } = useFetch({
        ...apiConfig.account.requestForgetPassword,
    });
    useEffect(() => {
        if (data) form.setFieldsValue({ ...data });
    }, [data]);

    const handleFinish = (values) => {
        let data;
        data = { otp: values.otp, idHash: idHash };
        execute({
            data: { ...data },
            onCompleted: (res) => {
                setSecondsLeft(300);
                setIsCounting(false);
                // setCacheAccessToken(res.access_token);
                // executeGetProfile();
                navigate('/login');
                onCancel();
                form.resetFields();
            },
            onError: (error) => {
                if (error.code === 'ERROR-ACCOUNT-0005' || error.code === 'ERROR-ACCOUNT-0006')
                    showErrorMessage('Vui lòng nhập mã khác!');
                setSecondsLeft(300);
                setIsCounting(false);
                // console.log(error.code);
                form.resetFields();
            },
        });
    };

    const [secondsLeft, setSecondsLeft] = useState();
    const [isCounting, setIsCounting] = useState(false);

    const handleGetOtp = () => {
        // Xử lý sự kiện khi người dùng click vào "Quên mật khẩu?"
        console.log('Người dùng đã click vào "Quên mật khẩu?"');
        // const email = form.getFieldValue('email');
        let data;
        data = { email: email };
        executeRequestForgetPassword({
            data: { ...data },
            onCompleted: (response) => {
                <Alert message="OTP đã được gửi" description="Vui lòng kiểm tra email." type="success" showIcon />;
                setSecondsLeft(300);
                setIsCounting(true);
                form.resetFields();
            },
            onError: (error) => {
                showErrorMessage(error.message);
                setSecondsLeft(300);
                setIsCounting(false);
                form.resetFields();
            },
        });
    };

    useEffect(() => {
        let timer;
        if (isCounting) {
            timer = setInterval(() => {
                setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
        // console.log(isCounting);
    }, [isCounting]);

    const formattedTime = `${Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;


    const [loadings, setLoadings] = useState([]);
    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 4000);
    };

    return (
        <Modal
            title={<FormattedMessage defaultMessage="Vui lòng kiểm tra email và nhập OTP" />}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <BaseForm form={form} onFinish={handleFinish} size="100%">
                <Card>
                    <Form.Item label="OTP" extra="Vui lòng kiểm tra email!">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="otp"
                                    noStyle
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mã otp!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                {isCounting && secondsLeft > 1 ? (
                                    <Button>
                                        <Statistic
                                            value={formattedTime}
                                            valueStyle={{ fontSize: 15, fontWeight: 500 }}
                                        />
                                        <a
                                            style={{ fontSize: 12, marginTop: 5 }}
                                            onClick={(e) => {
                                                setIsCounting(false);
                                                setSecondsLeft(300);
                                                enterLoading(0);
                                                e.stopPropagation();
                                                handleGetOtp();
                                            }}
                                        >
                                            Gửi lại OTP
                                        </a>
                                    </Button>
                                ) : (
                                    <Button
                                        loading={loadings[0]}
                                        onClick={(e) => {
                                            enterLoading(0);
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
                    </Form.Item>
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default ListDetailsForm;
