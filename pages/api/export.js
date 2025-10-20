/**
 * Export API
 * Export user data as JSON, PDF, or CSV
 */

import jwt from 'jsonwebtoken';
import { db } from '../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { format, dataType, dateRange } = req.body;

    // Validate format
    const validFormats = ['json', 'csv', 'text'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({ 
        error: 'Invalid format',
        validFormats 
      });
    }

    // Validate dataType
    const validDataTypes = ['vows', 'reflections', 'triggers', 'all'];
    if (!validDataTypes.includes(dataType)) {
      return res.status(400).json({ 
        error: 'Invalid data type',
        validDataTypes 
      });
    }

    // Fetch user data
    const userData = await fetchUserData(userId, dataType, dateRange);

    // Format data based on requested format
    let exportedData;
    let contentType;
    let filename;

    switch (format) {
      case 'json':
        exportedData = JSON.stringify(userData, null, 2);
        contentType = 'application/json';
        filename = `vow-export-${dataType}-${Date.now()}.json`;
        break;
        
      case 'csv':
        exportedData = convertToCSV(userData, dataType);
        contentType = 'text/csv';
        filename = `vow-export-${dataType}-${Date.now()}.csv`;
        break;
        
      case 'text':
        exportedData = convertToText(userData, dataType);
        contentType = 'text/plain';
        filename = `vow-export-${dataType}-${Date.now()}.txt`;
        break;
    }

    // Log export
    console.log('[DATA_EXPORT]', {
      timestamp: new Date().toISOString(),
      userId,
      format,
      dataType
    });

    // Return data
    return res.status(200).json({
      success: true,
      data: exportedData,
      filename,
      contentType
    });

  } catch (error) {
    console.error('[EXPORT_ERROR]', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(500).json({ 
      error: 'Failed to export data',
      message: error.message 
    });
  }
}

/**
 * Fetch user data from Firestore
 */
async function fetchUserData(userId, dataType, dateRange) {
  const data = {
    exportedAt: new Date().toISOString(),
    userId
  };

  if (dataType === 'vows' || dataType === 'all') {
    const vowsSnapshot = await db
      .collection('vows')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    data.vows = vowsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  if (dataType === 'reflections' || dataType === 'all') {
    const reflectionsSnapshot = await db
      .collection('reflections')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    data.reflections = reflectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  if (dataType === 'triggers' || dataType === 'all') {
    const triggersSnapshot = await db
      .collection('triggers')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    
    data.triggers = triggersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  return data;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data, dataType) {
  if (dataType === 'vows' && data.vows) {
    const headers = ['Date', 'Statement', 'Category', 'Duration', 'Status', 'Current Day'];
    const rows = data.vows.map(vow => [
      vow.createdAt,
      vow.statement,
      vow.category,
      vow.duration,
      vow.status,
      vow.currentDay
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  if (dataType === 'reflections' && data.reflections) {
    const headers = ['Date', 'Stage', 'Emotion', 'Text'];
    const rows = data.reflections.map(r => [
      r.createdAt,
      r.stage || '',
      r.emotion || '',
      `"${(r.text || '').replace(/"/g, '""')}"`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  if (dataType === 'triggers' && data.triggers) {
    const headers = ['Date', 'Description', 'Intensity'];
    const rows = data.triggers.map(t => [
      t.timestamp,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.intensity || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  return 'No data available';
}

/**
 * Convert data to readable text format
 */
function convertToText(data, dataType) {
  let text = `VOW THEORY DATA EXPORT\n`;
  text += `Exported: ${data.exportedAt}\n`;
  text += `User ID: ${data.userId}\n`;
  text += `${'='.repeat(60)}\n\n`;

  if (dataType === 'vows' && data.vows) {
    text += `VOWS (${data.vows.length})\n`;
    text += `${'-'.repeat(60)}\n\n`;
    
    data.vows.forEach((vow, i) => {
      text += `${i + 1}. ${vow.statement}\n`;
      text += `   Created: ${formatDate(vow.createdAt)}\n`;
      text += `   Category: ${vow.category}\n`;
      text += `   Duration: ${vow.duration} days\n`;
      text += `   Progress: Day ${vow.currentDay}/${vow.duration}\n`;
      text += `   Status: ${vow.status}\n\n`;
    });
  }

  if (dataType === 'reflections' && data.reflections) {
    text += `REFLECTIONS (${data.reflections.length})\n`;
    text += `${'-'.repeat(60)}\n\n`;
    
    data.reflections.forEach((r, i) => {
      text += `${i + 1}. ${formatDate(r.createdAt)}\n`;
      text += `   Stage: ${r.stage || 'Not specified'}\n`;
      text += `   Emotion: ${r.emotion || 'Not specified'}\n`;
      text += `   ${r.text}\n\n`;
    });
  }

  if (dataType === 'triggers' && data.triggers) {
    text += `TRIGGERS (${data.triggers.length})\n`;
    text += `${'-'.repeat(60)}\n\n`;
    
    data.triggers.forEach((t, i) => {
      text += `${i + 1}. ${formatDate(t.timestamp)}\n`;
      text += `   ${t.description}\n`;
      if (t.intensity) text += `   Intensity: ${t.intensity}\n`;
      text += `\n`;
    });
  }

  return text;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
