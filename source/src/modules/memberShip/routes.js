import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import MemberShipListPage from '.';
export default {
    memberShipListPage: {
        path: '/member-ship',
        auth: true,
        component: MemberShipListPage,
        permission: [apiConfig.account.getList.baseURL],
        pageOptions: {
            objectName: commonMessage.memberShip,
            renderBreadcrumbs: (messages, t = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.memberShip) }];
            },
        },
    },
};
