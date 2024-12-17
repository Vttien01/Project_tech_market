import { PlusOutlined } from '@ant-design/icons';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Col, Flex, Form, Modal, Row, Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import VariantModal from './VariantModal';
import ListVariantTable from './ListVariantTable';
import RichTextField from '@components/common/form/RichTextField';
import ListRelatedTable from './ListRelatedTable';
import RelatedModal from './RelatedModal';
import { getImageUrl } from '@utils';
import NumericField from '@components/common/form/NumericField';

const messages = defineMessages({
    objectName: 'Sản phẩm',
    title: 'Bạn có xác nhận xoá yêu cầu này?',
    titleRelated: 'Bạn có xác nhận xoá sản phẩm liên quan này?',
    ok: 'Đồng ý',
    cancel: 'Huỷ',
});
const ProductForm = ({
    isEditing,
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    listProduct,
    loadingGetList,
    listProductRelated,
    loadingGetListRelated,
}) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [listData, setListData] = useState([]);
    const [item, setItem] = useState(null);
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [openedRelatedModal, handlerRelatedModal] = useDisclosure(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const {
        form: formRequest,
        mixinFuncs,
        onValuesChange,
    } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            image: imageUrl,
            listDetails: listData.map((item) => ({
                ...item,
                file: [item.image],
            })),
            relatedProducts: selectedRowIds,
        });
    };

    useEffect(() => {
        if (listProductRelated != null && listProductRelated?.length > 0) {
            setSelectedRows(listProductRelated);
            const excludeIds = listProductRelated.map(({ id }) => id);
            setSelectedRowIds(excludeIds);
        }
    }, [listProductRelated]);

    useEffect(() => {
        if (dataDetail?.listProductVariant) {
            setListData(
                dataDetail?.listProductVariant.map((item, index) => ({
                    ...item,
                    index,
                    id: item.id,
                })),
            );
            formRequest.setFieldsValue({
                ...dataDetail,
                price: dataDetail.price.toString(),
                saleOff: dataDetail?.saleOff.toString(),
                brandId: dataDetail?.brandDto?.id,
                categoryId: dataDetail?.categoryDto?.id,
            });
            setImageUrl(getImageUrl(dataDetail.image));
        }
        if (dataDetail?.relatedProducts) {
            setSelectedRows(dataDetail?.relatedProducts);
        }
    }, [dataDetail]);

    const handleAddList = useCallback((item) => {
        setListData((pre) => {
            return [...pre, { ...item, index: pre.length + 1 }];
        });
        setIsChangedFormValues(true);
    }, []);

    const handleEditItemList = useCallback((item) => {
        setListData((pre) => {
            return pre.map((_item) => {
                if (_item.index === item.index) return item;
                return _item;
            });
        });
        setIsChangedFormValues(true);
    }, []);

    const handleEditList = useCallback((item) => {
        setItem(item);
        handlerDetailsModal.open();
        setIsChangedFormValues(true);
    }, []);

    const handleDeleteList = useCallback((index) => {
        Modal.confirm({
            title: translate.formatMessage(messages.title),
            content: '',
            okText: translate.formatMessage(messages.ok),
            cancelText: translate.formatMessage(messages.cancel),
            onOk: () => {
                setListData((pre) => pre.filter((_) => _.index !== index));
                setIsChangedFormValues(true);
            },
        });
    }, []);

    const handleDeleteRelatedList = useCallback((index) => {
        Modal.confirm({
            title: translate.formatMessage(messages.titleRelated),
            content: '',
            okText: translate.formatMessage(messages.ok),
            cancelText: translate.formatMessage(messages.cancel),
            onOk: () => {
                setSelectedRows((pre) => pre.filter((_) => _.id !== index));
                setSelectedRowIds((pre) => pre.filter((_) => _ !== index));
                setIsChangedFormValues(true);
            },
        });
    }, []);

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
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    return (
        <div>
            <BaseForm formId={formId} onFinish={handleSubmit} form={formRequest} onValuesChange={onValuesChange}>
                <Card>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <VariantModal
                            open={openedDetailsModal}
                            onCancel={() => handlerDetailsModal.close()}
                            data={item}
                            isEditing={!!item}
                            handleAddList={handleAddList}
                            form={form}
                            handleEditItemList={handleEditItemList}
                        />
                        <RelatedModal
                            open={openedRelatedModal}
                            onCancel={() => handlerRelatedModal.close()}
                            handleAddList={handleAddList}
                            form={form}
                            handleEditItemList={handleEditItemList}
                            listProduct={listProduct}
                            loading={loadingGetList}
                            setSelectedRows={setSelectedRows}
                            setSelectedRowIds={setSelectedRowIds}
                            excludeIds={selectedRowIds || []}
                            setIsChangedFormValues={setIsChangedFormValues}
                        />
                    </Col>
                    <Row>
                        <Col span={12}>
                            <CropImageField
                                label={<FormattedMessage defaultMessage="Ảnh" />}
                                name="image"
                                imageUrl={imageUrl}
                                aspect={1 / 1}
                                uploadFile={uploadFile}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Thương hiệu" />}
                                name="brandId"
                                apiConfig={apiConfig.brand.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                initialSearchParams={{}}
                                searchParams={(text) => ({ name: text })}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Loại" />}
                                name="categoryId"
                                apiConfig={apiConfig.category.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                initialSearchParams={{}}
                                searchParams={(text) => ({ name: text })}
                                required
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Tên sản phẩm" />}
                                name="name"
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                disabled={dataDetail?.state === 3 || (dataDetail?.state === 4 && true)}
                                name="status"
                                label={<FormattedMessage defaultMessage="Trạng thái" />}
                                allowClear={false}
                                options={statusValues}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Giá sản phẩm" />}
                                name="price"
                                required
                                min={1000}
                                addonAfter={'đ'}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField label={<FormattedMessage defaultMessage="Giảm giá" />} name="saleOff" />
                        </Col>
                    </Row>
                    <RichTextField
                        width={'100%'}
                        label={<FormattedMessage defaultMessage="Mô tả ngắn" />}
                        name="description"
                        type="textarea"
                    />

                    <Card bordered style={{ marginBottom: '1rem' }}>
                        <Flex align="center" justify="space-between" style={{ marginBottom: '1rem' }}>
                            <Title level={4}>
                                <FormattedMessage defaultMessage="Danh sách yêu cầu" />
                            </Title>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setItem(null);
                                    handlerDetailsModal.open();
                                    form.resetFields();
                                }}
                                style={{ width: '150px' }}
                            >
                                <PlusOutlined /> <FormattedMessage defaultMessage="Thêm variant" />
                            </Button>
                        </Flex>

                        <ListVariantTable
                            data={listData}
                            handleEditList={handleEditList}
                            handleDeleteList={handleDeleteList}
                        />
                    </Card>
                    <Card bordered style={{ marginBottom: '1rem' }}>
                        <Flex align="center" justify="space-between" style={{ marginBottom: '1rem' }}>
                            <Title level={4}>
                                <FormattedMessage defaultMessage="Danh sách sản phẩm liên quan" />
                            </Title>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setItem(null);
                                    handlerRelatedModal.open();
                                    form.resetFields();
                                }}
                                style={{ width: '150px' }}
                            >
                                <PlusOutlined /> <FormattedMessage defaultMessage="Thêm sản phẩm" />
                            </Button>
                        </Flex>
                        <Spin spinning={loadingGetList || loadingGetListRelated}>
                            <ListRelatedTable data={selectedRows} handleDeleteRelatedList={handleDeleteRelatedList} />
                        </Spin>
                    </Card>
                    <div className="footer-card-form">{actions}</div>
                </Card>
            </BaseForm>
        </div>
    );
};

export default ProductForm;
