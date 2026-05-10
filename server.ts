import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/submit-workout', async (req, res) => {
    const workoutData = req.body;
    console.log('Received workout data:', workoutData);

    const sheetId = process.env.GOOGLE_SHEETS_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!sheetId || !clientEmail || !privateKey) {
      console.warn('Google Sheets credentials missing. Logging to console only.');
      // return res.status(500).json({ error: 'Google Sheets credentials missing' });
      // In development/preview mode, we'll simulate success if keys aren't set yet
      return res.json({ success: true, message: 'Data logged to server console (Credentials missing for real sheet)' });
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      
      // Prepare row data
      const values = [
        [
          workoutData.timestamp,
          workoutData.athleteName,
          workoutData.category,
          workoutData.rpe,
          workoutData.sessionDuration || '',
          workoutData.discipline || '',
          workoutData.type || '',
          workoutData.rounds || '',
          workoutData.mancheDuration || '',
          (workoutData.requests || []).join(', '),
          workoutData.summary || '',
          workoutData.description || '',
          workoutData.funFactor !== undefined ? workoutData.funFactor : '',
          (workoutData.prepTypes || []).join(', '),
          workoutData.intensity !== undefined ? workoutData.intensity : '',
          workoutData.volume !== undefined ? workoutData.volume : '',
        ]
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:P', // Adjust range as needed
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error writing to Google Sheets:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
