import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import route from '@routes';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import VoucherForm from './VoucherForm';

function VoucherSavePage() {
    const id = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.voucher.getById,
            create: apiConfig.voucher.create,
            update: apiConfig.voucher.update,
        },
        options: {
            getListUrl: generatePath(route.voucherListPage.path, { id }),
            objectName: 'Voucher',
        },
        override: (funcs) => {
            // funcs.mappingData = (response) => {
            //     if (response.result === true) {
            //         return {
            //             data: response.data.content,
            //             total: response.data.totalElements,
            //         };
            //     }
            // };
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
                    breadcrumbName: translate.formatMessage(commonMessage.voucher),
                    path: generatePath(route.voucherListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <VoucherForm
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

export default VoucherSavePage;
