import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import useFetch from '@hooks/useFetch';

const message = defineMessages({
    objectName: 'Product',
});

const ProductSavePage = () => {
    const CompanyRequestId = useParams();
    const translate = useTranslate();
    const { profile } = useAuth();
    const { id } = useParams();
    const { pathname: pagePath, search } = useLocation();
    const {
        data: listProduct,
        execute: executeGetList,
        loading: loadingGetList,
    } = useFetch(apiConfig.product.getList, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });
    const {
        data: listProductRelated,
        execute: executeGetListRelated,
        loading: loadingGetListRelated,
    } = useFetch(apiConfig.product.getListRelated, {
        immediate: false,
        mappingData: ({ data }) => data,
    });
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.product.getById,
            create: apiConfig.product.create,
            update: apiConfig.product.update,
        },
        options: {
            getListUrl: routes.productListPage.path + search,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return { ...data };
            };
        },
    });
    useEffect(() => {
        if (detail) {
            executeGetList({
                params: {
                    size: 1000,
                },
            });
            executeGetListRelated({
                pathParams: {
                    id,
                },
            });
        }
    }, [id, detail]);
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.objectName),
                    path: generatePath(routes.productListPage.path + search),
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
                loadingGetList={loadingGetList}
                listProduct={listProduct}
                listProductRelated={listProductRelated}
                loadingGetListRelated={loadingGetListRelated}
            />
        </PageWrapper>
    );
};
export default ProductSavePage;
