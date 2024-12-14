import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import route from '@routes';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import OrderAdminForm from './OrderAdminForm';
import { STATE_PENDING } from '@constants';

function OrderAdminSavePage() {
    const brandId = useParams();
    const translate = useTranslate();
    const { pathname: pagePath, search } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const state = queryParameters.get('state');
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.order.getById,
            create: apiConfig.order.create,
            update: apiConfig.order.update,
        },
        options: {
            getListUrl: generatePath(route.OrderPageAdmin.path + `?state=${state || STATE_PENDING}`),
            objectName: 'Đơn hàng',
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: 'Đơn hàng',
                    path: route.OrderPageAdmin.path + `?state=${state || STATE_PENDING}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <OrderAdminForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default OrderAdminSavePage;
