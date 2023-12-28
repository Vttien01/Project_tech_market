import React, { useEffect, useState } from 'react';
import Dashboard from '.';
import PageWrapper from '@components/common/layout/PageWrapper';

const DashboardPage = () => {
    const breadRoutes = [{ breadcrumbName: 'Thống kê' }];
    return (
        <PageWrapper routes={breadRoutes}>
            <Dashboard/>
        </PageWrapper>
    );
};

export default DashboardPage;
