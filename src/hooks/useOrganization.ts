// hooks/useOrganization.ts
import { useState, useEffect } from 'react';
import { config } from '../utils/config';

interface Division {
  id: number;
  div_id: string;
  div_name: string;
}

interface Department {
  id: number;
  dept_id: string;
  dept_name: string;
  division_id: number;
}

interface Team {
  id: number;
  team_id: string;
  team_name: string;
  department_id: number;
}

interface OrganizationInfo {
  division: Division | null;
  department: Department | null;
  team: Team | null;
  loading: boolean;
  error: string | null;
  scope: string;
}

// Position scope mapping based on your backend rules
const getScopeForPosition = (position: string): string => {
  const positionRules: Record<string, { level: number; scope: string }> = {
    "Admin": { level: 100, scope: "all" },
    "Chairman": { level: 95, scope: "all" },
    "CEO": { level: 95, scope: "all" },
    "Vice President": { level: 90, scope: "all" },
    "Director": { level: 90, scope: "all" },
    "General Manager": { level: 85, scope: "all" },
    "Deputy General Manager": { level: 80, scope: "division" },
    "Senior Executive Manager": { level: 70, scope: "department" },
    "Executive Manager": { level: 70, scope: "department" },
    "Manager": { level: 60, scope: "team" },
    "Senior Project Manager": { level: 60, scope: "team" },
    "Project Manager": { level: 60, scope: "team" },
    "Deputy Project Manager": { level: 55, scope: "team" },
  };
  
  return positionRules[position]?.scope || "self";
};

export const useOrganization = (staffPosition?: string, divisionId?: number | null, departmentId?: number | null, teamId?: number | null) => {
  const [division, setDivision] = useState<Division | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scope = staffPosition ? getScopeForPosition(staffPosition) : 'self';

  const fetchDivision = async () => {
    if (!divisionId || scope !== 'division') {
      setDivision(null);
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${config.apiUrl}/division/${divisionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setDivision(data);
        return data;
      } else {
        setDivision(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching division:', err);
      setDivision(null);
      return null;
    }
  };

  const fetchDepartment = async () => {
    if (!departmentId || scope !== 'department') {
      setDepartment(null);
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${config.apiUrl}/department/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setDepartment(data);
        return data;
      } else {
        setDepartment(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching department:', err);
      setDepartment(null);
      return null;
    }
  };

  const fetchTeam = async () => {
    if (!teamId || (scope !== 'team' && scope !== 'department' && scope !== 'division' && scope !== 'all')) {
      setTeam(null);
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${config.apiUrl}/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTeam(data);
        return data;
      } else {
        setTeam(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching team:', err);
      setTeam(null);
      return null;
    }
  };

  const fetchOrganizationData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Only fetch based on the user's scope
      switch (scope) {
        case 'all':
          // For Admin and top management, show nothing specific (they see everything)
          setDivision(null);
          setDepartment(null);
          setTeam(null);
          break;
        case 'division':
          // For Deputy General Manager - show only division
          await fetchDivision();
          setDepartment(null);
          setTeam(null);
          break;
        case 'department':
          // For Senior/Executive Manager - show only department
          await fetchDepartment();
          setDivision(null);
          setTeam(null);
          break;
        case 'team':
          // For Manager/Project Manager - show only team
          await fetchTeam();
          setDivision(null);
          setDepartment(null);
          break;
        default:
          // For self scope (regular staff) - show nothing
          setDivision(null);
          setDepartment(null);
          setTeam(null);
          break;
      }
    } catch (err) {
      setError('Failed to fetch organization information');
      console.error('Error fetching organization info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, [staffPosition, divisionId, departmentId, teamId, scope]);

  const refetch = () => {
    fetchOrganizationData();
  };

  // Helper to get the appropriate label based on scope
  const getOrganizationLabel = () => {
    switch (scope) {
      case 'division': return 'Division';
      case 'department': return 'Department';
      case 'team': return 'Team';
      default: return null;
    }
  };

  // Helper to get the organization name based on scope
  const getOrganizationName = () => {
    switch (scope) {
      case 'division': return division?.div_name || null;
      case 'department': return department?.dept_name || null;
      case 'team': return team?.team_name || null;
      default: return null;
    }
  };

  return {
    division,
    department,
    team,
    loading,
    error,
    scope,
    refetch,
    organizationLabel: getOrganizationLabel(),
    organizationName: getOrganizationName(),
    hasOrganization: scope !== 'self' && scope !== 'all',
  };
};