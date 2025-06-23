import React,{useState}from 'react';
import './Dashboard.css';
import { FaUsers, FaCalendarAlt, FaProjectDiagram,FaTrophy, FaChalkboardTeacher, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar';
import facultyDataDash from '../components/FacultyData';
import contentDash from '../components/content'
import eventDataDash from '../components/description';
import projectDataDash from '../components/projectData'
const Dashboard = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const currentYear = new Date().getFullYear();
    const lenFacultyData =  facultyDataDash.length
    const lenExecutiveMem = contentDash.filter(item => item.year === 2024).length;
    const today = new Date();
    const upcomingEvents = eventDataDash.filter(item => new Date(item.date) > today).length;
    const lenProjectData =  projectDataDash.filter(item => item.year === currentYear && item.status === 'completed').length ;

    const facultyData = facultyDataDash
    const memberData = contentDash.filter(item => item.year === 2024 );

    // Event Chart
    
    const previousYear = currentYear - 1;

    const eventsByYear = {};
    eventDataDash.forEach(event => {
      const year = new Date(event.date).getFullYear();
      eventsByYear[year] = (eventsByYear[year] || 0) + 1;
    });


    const filteredYears = Object.keys(eventsByYear)
      .map(year => parseInt(year))
      .filter(year => year >= previousYear)
      .sort((a, b) => a - b); // Ensure chronological order

    const chartData = filteredYears.map(year => ({
      name: year.toString(),
      events: eventsByYear[year]
    }));

    // Project piechart
   const statusCount = {};
    projectDataDash.forEach(project => {
      const status = project.status?.toLowerCase(); // ensure lowercase match

      // Only count if status is 'completed', 'ongoing', or 'planning'
      if (status === 'completed' || status === 'ongoing' || status === 'planning') {
        statusCount[status] = (statusCount[status] || 0) + 1;
      }
    });

    // Convert to array for PieChart
    const projectStatusData = Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize
      value: statusCount[status]
    }));


  const achievementData = [
    { name: 'Academic', value: 15 },
    { name: 'Sports', value: 8 },
    { name: 'Cultural', value: 12 },
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
        <h1>Hi,Dev</h1>
        {/* <p>Welcome back! Here's what's happening with your association.</p> */}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon" style={{ backgroundColor: '#ffebee' }}>
            <FaChalkboardTeacher  style={{ color: '#d32f2f' }} />
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
            <h3>Exective Members</h3>
            <p>{lenExecutiveMem}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon" style={{ backgroundColor: '#ffebee' }}>
            <FaCalendarAlt style={{ color: '#d32f2f' }} />
          </div>
          <div className="card-content">
            <h3>Upcomming Events</h3>
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

      {/* Charts Section */}
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

      {/* Additional Information Section */}
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
                  {/* <span>{faculty.department}</span> */}
                </div>
              </div>
            ))}
          </div>
        </div>

         <div className="executive-members">
          <h3><FaUsers /> Executive Members</h3>
          <div className="members-list">
            {memberData.slice(0,4).map(member => (
              <div key={member.id} className="member-card">
                <div className="member-avatar">{member.name.charAt(0)}</div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p>{member.position}</p>
                  {/* <span>{member.department}</span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Distribution */}
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