import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import apiConfig from '@constants/apiConfig';
import route from '@routes';
import { generatePath, useParams } from 'react-router-dom';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import OrderAdminForm from './OrderAdminForm';

function OrderAdminSavePage() {
    const brandId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.order.getById,
            create: apiConfig.order.create,
            update: apiConfig.order.update,
        },
        options: {
            getListUrl: generatePath(route.OrderPageAdmin.path, { brandId }),
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
                    breadcrumbName: "Đơn hàng",
                    path: generatePath(route.OrderPageAdmin.path),
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
