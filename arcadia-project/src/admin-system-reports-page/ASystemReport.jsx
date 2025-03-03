import React, { useEffect, useState } from 'react';
import Title from "../components/main-comp/Title";
import OutstandingFines from "../components/admin-system-reports-comp/OutstandingFines";
import PenaltyReports from "../components/admin-system-reports-comp/PenaltyReports";
import SBOverdue from "../components/admin-system-reports-comp/SBOverdue";
import SBFines from "../components/admin-system-reports-comp/SBFines";

const ASystemReport = () => {
    const [exportedData, setExportedData] = useState(null);

    return (
        <div className="min-h-screen bg-white">
            <Title>System Reports</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                    <OutstandingFines onDataExport={setExportedData} />
                    <PenaltyReports exportData={exportedData}/>
                </div>
                <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                    <SBFines />
                    <SBOverdue />
                </div>
            </div>
        </div>
    );
};

export default ASystemReport;
