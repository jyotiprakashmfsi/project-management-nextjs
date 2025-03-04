'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { handleApiError } from '@/utils/errorHandling';

export default function ErrorHandlingExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Example function that simulates an API call that might fail
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      const response = await new Promise<any>((resolve, reject) => {
        setTimeout(() => {
          // Randomly succeed or fail
          if (Math.random() > 0.5) {
            resolve({ success: true, data: { message: 'Data loaded successfully!' } });
          } else {
            reject(new Error('Failed to load data. This is a simulated error.'));
          }
        }, 1000);
      });
      
      setData(response.data);
    } catch (err) {
      // Use our error handling utility
      const errorMessage = handleApiError(err, 'Failed to fetch data');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to trigger an unhandled error (will be caught by ErrorHandler)
  const triggerGlobalError = () => {
    // This will be caught by our global error handler
    throw new Error('This is a deliberately triggered error to test global error handling');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Error Handling Example</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={fetchData} 
        />
      )}
      
      {data && !error && (
        <div className="p-4 bg-green-50 text-green-700 rounded mb-4">
          {data.message}
        </div>
      )}
      
      <div className="flex flex-col space-y-4">
        <Button 
          onClick={fetchData} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Fetch Data (50% chance of error)'}
        </Button>
        
        <Button 
          onClick={triggerGlobalError}
          className="bg-red-600 hover:bg-red-700"
        >
          Trigger Global Error
        </Button>
        
        <div className="text-sm text-gray-600 mt-4">
          <p>This component demonstrates:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Local error handling with try/catch</li>
            <li>Using the ErrorMessage component</li>
            <li>Using the handleApiError utility</li>
            <li>Global error handling (click "Trigger Global Error")</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
