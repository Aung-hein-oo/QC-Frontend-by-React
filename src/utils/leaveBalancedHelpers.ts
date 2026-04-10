import { LeaveBalance } from '../types';

export interface LeaveBalanceDisplay {
  leaveType: string;
  previous: number;
  entitle: number;
  taken: number;
  balance: number;
}

// Default leave entitlements (you can adjust these values)
const DEFAULT_ENTITLEMENTS = {
  casual: 6,
  earn: 5.8,
  family_funeral_health: 5.8,
  medical: 30,
  married: 30,
  maternity_paternity: 30,
  leave_with_pay: 30,
  leave_without_pay: 30,
};

export const formatLeaveBalanceData = (
  leaveBalance: LeaveBalance | null,
  staffGender?: string
): LeaveBalanceDisplay[] => {
  if (!leaveBalance) {
    // Return empty/default structure if no data
    return [
      { leaveType: 'Casual Leave', previous: 0, entitle: DEFAULT_ENTITLEMENTS.casual, taken: 0, balance: DEFAULT_ENTITLEMENTS.casual },
      { leaveType: 'Earn Leave', previous: 0, entitle: DEFAULT_ENTITLEMENTS.earn, taken: 0, balance: DEFAULT_ENTITLEMENTS.earn },
      { leaveType: 'Family Funeral or Health Care Leave', previous: 0, entitle: DEFAULT_ENTITLEMENTS.family_funeral_health, taken: 0, balance: DEFAULT_ENTITLEMENTS.family_funeral_health },
      { leaveType: 'Medical Leave', previous: 0, entitle: DEFAULT_ENTITLEMENTS.medical, taken: 0, balance: DEFAULT_ENTITLEMENTS.medical },
      { leaveType: 'Married Leave', previous: 0, entitle: DEFAULT_ENTITLEMENTS.married, taken: 0, balance: DEFAULT_ENTITLEMENTS.married },
      { leaveType: staffGender?.toLowerCase() === 'male' ? 'Paternity Leave' : 'Maternity Leave', previous: 0, entitle: DEFAULT_ENTITLEMENTS.maternity_paternity, taken: 0, balance: DEFAULT_ENTITLEMENTS.maternity_paternity },
      { leaveType: 'Leave With Pay', previous: 0, entitle: DEFAULT_ENTITLEMENTS.leave_with_pay, taken: 0, balance: DEFAULT_ENTITLEMENTS.leave_with_pay },
      { leaveType: 'Leave Without Pay', previous: 0, entitle: DEFAULT_ENTITLEMENTS.leave_without_pay, taken: 0, balance: DEFAULT_ENTITLEMENTS.leave_without_pay },
    ];
  }

  // Calculate taken leaves (Entitle - Balance)
  // Note: Adjust this logic based on your actual data structure
  const calculateTaken = (entitle: number, balance: number): number => {
    return Math.max(0, entitle - balance);
  };

  const leaveTypes = [
    {
      leaveType: 'Casual Leave',
      entitle: DEFAULT_ENTITLEMENTS.casual,
      balance: leaveBalance.cascual_leave || 0,
    },
    {
      leaveType: 'Earn Leave',
      entitle: DEFAULT_ENTITLEMENTS.earn,
      balance: 0, // You might need to add this to your API response
    },
    {
      leaveType: 'Family Funeral or Health Care Leave',
      entitle: DEFAULT_ENTITLEMENTS.family_funeral_health,
      balance: leaveBalance.family_funeral_health_leave || 0,
    },
    {
      leaveType: 'Medical Leave',
      entitle: DEFAULT_ENTITLEMENTS.medical,
      balance: leaveBalance.medical_leave || 0,
    },
    {
      leaveType: 'Married Leave',
      entitle: DEFAULT_ENTITLEMENTS.married,
      balance: leaveBalance.married_leave || 0,
    },
    {
      leaveType: staffGender?.toLowerCase() === 'male' ? 'Paternity Leave' : 'Maternity Leave',
      entitle: DEFAULT_ENTITLEMENTS.maternity_paternity,
      balance: staffGender?.toLowerCase() === 'male' 
        ? (leaveBalance as any).parternity_leave || 0
        : (leaveBalance as any).maternity_leave || 0,
    },
    {
      leaveType: 'Leave With Pay',
      entitle: DEFAULT_ENTITLEMENTS.leave_with_pay,
      balance: leaveBalance.leave_with_pay || 0,
    },
    {
      leaveType: 'Leave Without Pay',
      entitle: DEFAULT_ENTITLEMENTS.leave_without_pay,
      balance: leaveBalance.leave_without_pay || 0,
    },
  ];

  return leaveTypes.map(lt => ({
    leaveType: lt.leaveType,
    previous: 0, // You might need to track previous year's balance separately
    entitle: lt.entitle,
    taken: calculateTaken(lt.entitle, lt.balance),
    balance: lt.balance,
  }));
};