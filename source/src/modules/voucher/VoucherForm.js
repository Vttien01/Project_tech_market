import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import DatePickerField from '@components/common/form/DatePickerField';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { kindUseVoucherOptions, statusOptions, statusVoucherOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card, Col, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const VoucherForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [imageUrl, setImageUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (!values?.status) {
            values.status = 1;
        }
        return mixinFuncs.handleSubmit({
            ...values,
            expired: formatDateString(values?.expired, DEFAULT_FORMAT),
        });
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const validateDueDate = (_, value) => {
        if (value <= dayjs()) {
            return Promise.reject('Ngày hết hạn phải lớn hơn ngày hiện tại!');
        }
        return Promise.resolve();
    };
    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue({
                ...dataDetail,
                expired: dataDetail?.expired && dayjs(dataDetail.expired, DEFAULT_FORMAT),
            });
        }
    }, [dataDetail]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField label={<FormattedMessage defaultMessage="Voucher" />} name="title" required />
                    </Col>
                    <Col span={12}>
                        <NumericField label={<FormattedMessage defaultMessage="Số lượng" />} name="amount" required />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Giá giảm tối đa" />}
                            name="priceMax"
                            required
                            min={1000}
                            defaultValue={1000}
                            addonAfter={'đ'}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Phần trăm giảm" />}
                            name="percent"
                            required
                            min={0}
                            max={100}
                            defaultValue={0}
                            addonAfter={'%'}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="kind"
                            label={<FormattedMessage defaultMessage="Loại tài khoản áp dụng" />}
                            allowClear={false}
                            options={kindUseVoucherOptions}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày hết hạn" />}
                            name="expired"
                            required
                            showTime={true}
                            placeholder="Ngày hết hạn"
                            format={DEFAULT_FORMAT}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày giao hàng!',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="status"
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusVoucherOptions}
                        />
                    </Col>
                    <Col span={24}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Nội dung" />}
                            name="content"
                            type="textarea"
                            style={{ height: 300 }}
                            required
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default VoucherForm;
