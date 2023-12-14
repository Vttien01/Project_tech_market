import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';

const message = defineMessages({
    objectName: 'group permission',
    address: 'Địa chỉ',
});

const AddressForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const [isHasProvince, setIsHasProvince] = useState(isEditing ? true : false);
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);

    const handleProvinceChange = (selectedValue) => {
        if (selectedValue === null) {
            setProvince(null);
            console.log(1);
        } else {
            setProvince(selectedValue);
            console.log(province);
        }
        // Các xử lý khác dựa trên giá trị province
    };

    const handleDistrictChange = (selectedValue) => {
        setDistrict(selectedValue);
        // Các xử lý khác dựa trên giá trị district
    };

    useEffect(() => {
        // Thực hiện gọi lại AutoCompleteField của districtId khi province thay đổi
        // Nếu bạn muốn chắc chắn rằng nó chỉ được gọi lại khi province có giá trị, hãy thêm điều kiện kiểm tra ở đây
        if (province !== null) {
            // Gọi lại AutoCompleteField của districtId bằng cách cập nhật key (key={province}) để làm mới component
            setDistrict(null); // Đặt district về giá trị mặc định
        }
    }, [province]);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues();
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);
    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.Name)} name="name" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.phone)} name="phone" />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.Province)}
                            name="provinceId"
                            apiConfig={apiConfig.nation.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ kind: 1 }}
                            searchParams={(text) => ({ name: text, kind: 1 })}
                            onChange={handleProvinceChange}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.District)}
                            name="districtId"
                            apiConfig={apiConfig.nation.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ parentId: province, kind: 2 }}
                            searchParams={(text) => ({ name: text, kind: 2 })}
                            required
                            key={province}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.Village)}
                            name="wardId"
                            apiConfig={apiConfig.nation.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ kind: 3 }}
                            searchParams={(text) => ({ name: text, kind: 3 })}
                            required
                        />
                    </Col>

                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.address)} name="address" />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default AddressForm;
