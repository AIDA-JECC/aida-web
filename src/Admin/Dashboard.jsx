import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import {
  FaUsers, FaCalendarAlt, FaProjectDiagram, FaTrophy, FaChalkboardTeacher, FaChartLine
} from 'react-icons/fa';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Sidebar from './Sidebar';
import {
  getFacultyData,
  getExecutiveMembers,
  getEventData,
  getProjectData
} from '../ListOfFunctions';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [facultyData, setFacultyData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [username, setUsername] = useState('');

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const today = new Date();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        const name = user.user_metadata?.username || user.email;
        setUsername(name);
      }
    };

    const loadData = async () => {
      try {
        const faculty = await getFacultyData();
        const members = await getExecutiveMembers(2024);
        const events = await getEventData();
        const projects = await getProjectData();

        setFacultyData(faculty);
        setMemberData(members);
        setEventData(events);
        setProjectData(projects);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    loadData();
  }, []);

  const lenFacultyData = facultyData.length;
  const lenExecutiveMem = memberData.length;
  const upcomingEvents = eventData.filter(e => new Date(e.date) > today).length;
  const lenProjectData = projectData.length;

  const eventsByYear = {};
  eventData.forEach(event => {
    const year = new Date(event.date).getFullYear();
    eventsByYear[year] = (eventsByYear[year] || 0) + 1;
  });

  const filteredYears = Object.keys(eventsByYear)
    .map(year => parseInt(year))
    .filter(year => year >= previousYear)
    .sort((a, b) => a - b);

  const chartData = filteredYears.map(year => ({
    name: year.toString(),
    events: eventsByYear[year]
  }));

  const statusCount = {};
  projectData.forEach(project => {
    const status = project.status?.toLowerCase();
    if (['completed', 'ongoing', 'planning'].includes(status)) {
      statusCount[status] = (statusCount[status] || 0) + 1;
    }
  });

  const projectStatusData = Object.keys(statusCount).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: statusCount[status]
  }));

  const achievementData = [
    { name: 'Academic', value: 15 },
    { name: 'Sports', value: 8 },
    { name: 'Cultural', value: 12 }
  ];

  const COLORS = ['#ff4d4d', '#ff9999', '#ffcccc'];

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="mainDash">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="homeDashContainer">
        <div className="homeDashHeader">
          <h1>Hi, {username}</h1>
        </div>

        <div className="summary-cards">
          <div className="card">
            <div className="card-icon" style={{ backgroundColor: '#ffebee' }}>
              <FaChalkboardTeacher style={{ color: '#d32f2f' }} />
            </div>
            <div className="card-content">
              <h3>Faculty</h3>
              <p>{lenFacultyData}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon" style={{ backgroundColor: '#ffebee' }}>
              <FaUsers style={{ color: '#d32f2f' }} />
            </div>
            <div className="card-content">
              <h3>Executive Members</h3>
              <p>{lenExecutiveMem}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon" style={{ backgroundColor: '#ffebee' }}>
              <FaCalendarAlt style={{ color: '#d32f2f' }} />
            </div>
            <div className="card-content">
              <h3>Upcoming Events</h3>
              <p>{upcomingEvents}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon" style={{ backgroundColor: '#ffebee' }}>
              <FaProjectDiagram style={{ color: '#d32f2f' }} />
            </div>
            <div className="card-content">
              <h3>Projects Completed</h3>
              <p>{lenProjectData}</p>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <h3><FaChartLine /> Events This Year</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#d32f2f" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3><FaChartLine /> Project Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="info-section">
          <div className="executive-members">
            <h3><FaChalkboardTeacher /> Faculty Members</h3>
            <div className="members-list">
              {facultyData.slice(0, 4).map(faculty => (
                <div key={faculty.id} className="member-card">
                  <div className="member-avatar">{faculty.name.charAt(0)}</div>
                  <div className="member-info">
                    <h4>{faculty.name}</h4>
                    <p>{faculty.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="executive-members">
            <h3><FaUsers /> Executive Members</h3>
            <div className="members-list">
              {memberData.slice(0, 4).map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">{member.name.charAt(0)}</div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="achievement-section">
          <h3><FaTrophy /> Achievement Distribution</h3>
          <div className="achievement-chart">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={achievementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {achievementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
