import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Pagination, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface Translation {
  id: number;
  user_id: number;
  source_text: string;
  translated_text: string;
  source_lang: string;
  target_lang: string;
  created_at: string;
  user_email?: string;
}

const AdminTranslations: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTranslations = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/v1/admin/translations`, {
        params: {
          page,
          search: searchTerm,
          limit: 10
        }
      });
      setTranslations(response.data.translations);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTranslations(currentPage);
  }, [currentPage, fetchTranslations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTranslations(1);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Translation History</h4>
        <Form className="d-flex" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
          />
          <Button type="submit" variant="primary">Search</Button>
        </Form>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Source Text</th>
              <th>Translation</th>
              <th>Languages</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((translation) => (
              <tr key={translation.id}>
                <td>{translation.id}</td>
                <td>{translation.user_email}</td>
                <td>{translation.source_text.substring(0, 50)}...</td>
                <td>{translation.translated_text.substring(0, 50)}...</td>
                <td>{translation.source_lang} → {translation.target_lang}</td>
                <td>{new Date(translation.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage(curr => curr - 1)}
              disabled={currentPage === 1}
            />
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => Math.abs(page - currentPage) <= 2)
              .map(page => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
            
            <Pagination.Next
              onClick={() => setCurrentPage(curr => curr + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdminTranslations; 