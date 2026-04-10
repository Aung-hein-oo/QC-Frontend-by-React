export const calculateTotalLeaveDays = (
    startDate: string, 
    endDate: string, 
    leaveStatus?: string
): number => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (leaveStatus === "half") {
        if (diffDays === 1) {
            return 0.5;
        }
        return (diffDays - 1) + 0.5;
    }
    
    return diffDays > 0 ? diffDays : 0;
};

export const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0];
};