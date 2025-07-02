import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

const TeacherList = () => {
  // Pagination state variables
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Fetch teachers function with pagination parameters
  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call with pagination parameters
      const response = await fetch(`/api/teachers?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract pagination metadata from API response
      setTeachers(data.data);
      setTotalCount(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
      setPageSize(data.pagination.pageSize);
      setHasNext(data.pagination.hasNext);
      setHasPrevious(data.pagination.hasPrevious);
      
    } catch (err) {
      // For demo purposes, let's create mock data instead of showing error
      console.warn('API call failed, using mock data:', err.message);
      
      // Create mock teachers data for demonstration
      const mockTeachers = generateMockTeachers(page, limit);
      setTeachers(mockTeachers.data);
      setTotalCount(mockTeachers.pagination.total);
      setTotalPages(mockTeachers.pagination.totalPages);
      setCurrentPage(mockTeachers.pagination.currentPage);
      setPageSize(mockTeachers.pagination.pageSize);
      setHasNext(mockTeachers.pagination.hasNext);
      setHasPrevious(mockTeachers.pagination.hasPrevious);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for demonstration
  const generateMockTeachers = (page, limit) => {
    const totalTeachers = 95; // Mock total count
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalTeachers);
    
    const teachers = [];
    for (let i = startIndex; i < endIndex; i++) {
      teachers.push({
        id: i + 1,
        name: `Teacher ${i + 1}`,
        email: `teacher${i + 1}@school.com`,
        subject: ['Math', 'Science', 'English', 'History', 'Geography'][i % 5],
        experience: Math.floor(Math.random() * 15) + 1
      });
    }
    
    return {
      data: teachers,
      pagination: {
        total: totalTeachers,
        totalPages: Math.ceil(totalTeachers / limit),
        currentPage: page,
        pageSize: limit,
        hasNext: page < Math.ceil(totalTeachers / limit),
        hasPrevious: page > 1
      }
    };
  };

  // Page navigation functions
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchTeachers(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    fetchTeachers(1, newPageSize); // Reset to first page when changing page size
  };

  // Load initial data
  useEffect(() => {
    fetchTeachers(currentPage, pageSize);
  }, []);

  if (loading) {
    return <div className="loading">Loading teachers...</div>;
  }

  if (error) {
    return <div className="error">Error loading teachers: {error}</div>;
  }

  return (
    <div>
      <h2>Teachers List</h2>
      
      {/* Page size selector */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="pageSize">Teachers per page: </label>
        <select 
          id="pageSize"
          value={pageSize} 
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Teachers table */}
      <table className="teacher-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Experience (years)</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.subject}</td>
              <td>{teacher.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TeacherList;