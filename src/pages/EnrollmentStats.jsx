// src/components/EnrollmentStats.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Container, Typography, CircularProgress } from '@mui/material';

const EnrollmentStats = () => {
    const [departmentData, setDepartmentData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/enrollment/stats/admin');
                const stats = response.data;

                // Process data for departments
                const departmentMap = {};
                const teamMap = {};

                stats.forEach(stat => {
                    const { department, team } = stat._id;
                    if (!departmentMap[department]) {
                        departmentMap[department] = { totalEnrolled: 0, totalCompleted: 0 };
                    }
                    if (!teamMap[team]) {
                        teamMap[team] = { totalEnrolled: 0, totalCompleted: 0 };
                    }
                    departmentMap[department].totalEnrolled += stat.totalEnrolled;
                    departmentMap[department].totalCompleted += stat.totalCompleted;
                    teamMap[team].totalEnrolled += stat.totalEnrolled;
                    teamMap[team].totalCompleted += stat.totalCompleted;
                });

                setDepartmentData(Object.entries(departmentMap));
                setTeamData(Object.entries(teamMap));
            } catch (err) {
                setError('Failed to fetch statistics');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <CircularProgress style={{ marginTop: '90px' }} />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    const departmentLabels = departmentData.map(([department]) => department);
    const totalEnrolledByDept = departmentData.map(([, { totalEnrolled }]) => totalEnrolled);
    const totalCompletedByDept = departmentData.map(([, { totalCompleted }]) => totalCompleted);

    const teamLabels = teamData.map(([team]) => team);
    const totalEnrolledByTeam = teamData.map(([, { totalEnrolled }]) => totalEnrolled);
    const totalCompletedByTeam = teamData.map(([, { totalCompleted }]) => totalCompleted);

    const departmentChartOptions = {
        chart: { type: 'bar' },
        xaxis: { categories: departmentLabels },
        title: { text: 'Enrollment Statistics by Department' },
    };

    const teamChartOptions = {
        chart: { type: 'bar' },
        xaxis: { categories: teamLabels },
        title: { text: 'Enrollment Statistics by Team' },
    };

    return (
        <Container style={{ marginTop: '60px' }}>
            <Typography variant="h4" align="center" gutterBottom>Enrollment Statistics</Typography>
            <div>
                <Typography variant="h5">By Department</Typography>
                <Chart
                    options={departmentChartOptions}
                    series={[
                        { name: 'Total Enrolled', data: totalEnrolledByDept },
                        { name: 'Total Completed', data: totalCompletedByDept },
                    ]}
                    type="bar"
                    height={350}
                />
            </div>
            <div style={{ marginTop: '40px' }}>
                <Typography variant="h5">By Team</Typography>
                <Chart
                    options={teamChartOptions}
                    series={[
                        { name: 'Total Enrolled', data: totalEnrolledByTeam },
                        { name: 'Total Completed', data: totalCompletedByTeam },
                    ]}
                    type="bar"
                    height={350}
                />
            </div>
        </Container>
    );
};

export default EnrollmentStats;
