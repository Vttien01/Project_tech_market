import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT, paymentSelect } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row, notification } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { formSize, orderStateOption, orderStateValue, paidOptions, paymentOptions, statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import NumericField from '@components/common/form/NumericField';
import CropImageField from '@components/common/form/CropImageField';
import InputTextField from '@components/common/form/InputTextField';

const OrderAdminForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const [isDisableStartDate, setIsDisableStartDate] = useState(false);
    // const lectureStateOptions = translate.formatKeys(lectureState, ['label']);
    // const [lectureStateFilter, setLectureStateFilter] = useState([lectureStateOptions[0]]);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const paymentValues = translate.formatKeys(paymentOptions, ['label']);
    const orderStateValues = translate.formatKeys(orderStateValue, ['label']);
    const isPaidValues = translate.formatKeys(paidOptions, ['label']);

    const [bannerUrl, setBannerUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.expectedDeliveryDate = formatDateString(values?.expectedDeliveryDate, DATE_FORMAT_VALUE) + ' 00:00:00';
        // if (!values?.status) {
        //     values.status = 1;
        // }
        return mixinFuncs.handleSubmit({ ...values });
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const validateDueDate = (_, value) => {
        const { dateRegister } = form.getFieldValue();
        if (dateRegister && value && value <= dateRegister) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    useEffect(() => {
        if (dataDetail.state !== undefined && dataDetail.state !== 1) {
            setIsDisableStartDate(true);
        } else {
            setIsDisableStartDate(false);
        }
    }, [dataDetail.state]);
    const initialRules = [
        {
            required: true,
            message: 'Vui lòng chọn ngày bắt đầu',
        },
    ];
    // console.log(dataDetail);
    useEffect(() => {
        dataDetail.createdDate = dataDetail?.createdDate && dayjs(dataDetail?.createdDate, DATE_FORMAT_VALUE);
        dataDetail.expectedDeliveryDate = dataDetail?.expectedDeliveryDate && dayjs(dataDetail?.expectedDeliveryDate, DATE_FORMAT_VALUE);
        if (dataDetail ) form.setFieldsValue({ ...dataDetail  });
    }, [dataDetail]);

    const getRules = () => {
        let rules = [...initialRules];

        if (!isDisableStartDate) {
            rules.push({
                validator: validateStartDate,
            });
        }

        return rules;
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Tên người nhận" />}
                            name="receiver"
                            required
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Địa chỉ" />}
                            name="address"
                            disabled={isEditing}
                        />
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}></Col>
                    <Col span={12}></Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <InputTextField
                            label={<FormattedMessage defaultMessage="Tổng tiền thanh toán" />}
                            name="totalMoney"
                            readOnly={true}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled={isEditing}
                            name="paymentMethod"
                            label={<FormattedMessage defaultMessage="Phương thức thanh toán" />}
                            allowClear={false}
                            options={paymentValues}
                            style={{ width: '100%', height: 45 }}
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <DatePickerField
                            label="Ngày tạo"
                            showTime={false}
                            name="createdDate"
                            placeholder="Ngày tạo"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%', height: 30 }}
                            size="small"
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label="Ngày dự kiến giao hàng"
                            showTime={false}
                            name="expectedDeliveryDate"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%', height: 30 }}
                            size="small"
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <SelectField
                            // disabled={isEditing}
                            name="state"
                            label={<FormattedMessage defaultMessage="Trạng thái đơn hàng" />}
                            allowClear={false}
                            options={orderStateValues}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            // disabled={isEditing}
                            name="isPaid"
                            label={<FormattedMessage defaultMessage="Trạng thái thanh toán" />}
                            allowClear={false}
                            options={isPaidValues}
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}></Col>
                    <Col span={12}></Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default OrderAdminForm;
