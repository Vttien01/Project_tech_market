import { Button, Form, Image } from 'antd';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import imgContact from '@assets/images/imgContact.png';
import logo from '@assets/images/logoTech.png';
import InputTextField from '@components/common/form/InputTextField';
import SelectField from '@components/common/form/SelectField';
import { appAccount, loginOptions } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import { setCacheAccessToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { Buffer } from 'buffer';
import ListDetailsForm from './ListDetailsForm';
import './style.css';

window.Buffer = window.Buffer || Buffer;
const message = defineMessages({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Sai tên đăng nhập hoặc mật khẩu !!!',
    login: 'Đăng nhập',
});

const LoginPage = () => {
    const intl = useIntl();
    const translate = useTranslate();
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [form] = Form.useForm();
    const base64Credentials = Buffer.from(`${appAccount.APP_USERNAME}:${appAccount.APP_PASSWORD}`).toString('base64');
    const { execute, loading } = useFetch({
        ...apiConfig.account.loginBasic,
        authorization: `Basic ${base64Credentials}`,
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const { profile } = useAuth();

    const onFinish = (values) => {
        execute({
            data: { ...values,
                grant_type: 'password',
            },
            onCompleted: (res) => {
                setCacheAccessToken(res.access_token);
                executeGetProfile();
                console.log("login");
            },
            onError: (error) => {
                showErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác!");
                console.log(error.message);
            },
        });
    };
    const handleForgotPasswordClick = () => {
        console.log('Người dùng đã click vào "Quên mật khẩu?"');
        handlerDetailsModal.open();
    };

    return (
        <div className="grid-container">
            <ListDetailsForm open={openedDetailsModal} onCancel={() => handlerDetailsModal.close()} form={form} />
            <div className="area_login_left">
                {/* <div className="loginForm"> */}
                <div className="top">
                    <h2>Welcome to our website</h2>
                    <h4>Vui lòng đăng nhập</h4>
                </div>
                <Form
                    name="login-form"
                    onFinish={onFinish}
                    initialValues={{
                        username: '0965456023',
                        password: '123456',
                    }}
                    layout="vertical"
                >
                    <div className="input">
                        <InputTextField
                            name="username"
                            fieldProps={{ prefix: <UserOutlined /> }}
                            // label={intl.formatMessage(message.username)}
                            placeholder={intl.formatMessage(commonMessage.username)}
                            size="large"
                            required
                        />
                    </div>
                    <div className="input">
                        <InputTextField
                            name="password"
                            fieldProps={{ prefix: <LockOutlined /> }}
                            // label={intl.formatMessage(message.password)}
                            placeholder={intl.formatMessage(commonMessage.password)}
                            size="large"
                            required
                            type="password"
                        />
                        <i className="fa-solid fa-eye"></i>
                    </div>
                    
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        htmlType="submit"
                        className="btnLogin"
                        style={{ width: '100%' }}
                    >
                        {intl.formatMessage(message.login)}
                    </Button>
                </Form>
            </div>
            <div className="area_login_right">
                <Image
                    src={imgContact}
                    style={{ objectFit: 'cover', height: 500, width: 500, borderRadius: 20 }}
                    preview={false}
                />
            </div>
        </div>
    );
};

export default LoginPage;
