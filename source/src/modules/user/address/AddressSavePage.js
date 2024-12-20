import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import AddressForm from './AddressForm';
import routes from '@routes';

const message = defineMessages({
    objectName: 'address',
});

const AddressSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const queryParameters = new URLSearchParams(window.location.search);
    const userId = queryParameters.get('userId');
    const { search } = useLocation();
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.address.getById,
            create: apiConfig.address.create,
            update: apiConfig.address.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl + `?userId=${userId}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    status: STATUS_ACTIVE,
                    wardId: data.wardId,
                    provinceId: data.provinceId,
                    districtId: data.districtId,
                    id: id,
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
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
                    breadcrumbName: translate.formatMessage(commonMessage.user),
                    path: generatePath(routes.userListPage.path),
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.address),
                    path: generatePath(routes.addressListPage.path + search),
                },
                { breadcrumbName: title },
            ]}
        >
            <AddressForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default AddressSavePage;
