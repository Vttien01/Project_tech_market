import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import ProductForm from './ProductForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { useState } from 'react';
import { Button } from 'antd';
import ListPage from '@components/common/layout/ListPage';
import useAuth from '@hooks/useAuth';

const message = defineMessages({
    objectName: 'Product',
});

const ProductSavePage = () => {
    const CompanyRequestId = useParams();
    const translate = useTranslate();
    const { profile } = useAuth();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.product.getById,
            create: apiConfig.product.create,
            update: apiConfig.product.update,
        },
        options: {
            getListUrl: routes.productListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return { ...data };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.objectName),
                    path: generatePath(routes.productListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ProductForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default ProductSavePage;
