const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
import { VerifyErrors } from 'jsonwebtoken';
const bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';
import multer from 'multer'
import * as DocumentPicker from 'expo-document-picker';

import session, { Session, SessionData } from 'express-session';
const MySQLStore = require('express-mysql-session')(session);

interface CustomSessionData extends SessionData {
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface SessionRequest extends Request {
  session: Session & CustomSessionData;
}

const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    password: 'Norica11mysql.ro',
    database: 'health_app',
  });
  

import { QueryError, RowDataPacket } from 'mysql2';
  
  interface AuthenticatedRequest extends Request {
    user?: CustomSessionData['user'];
  }

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: ['http://192.168.1.128:8081', 'http://localhost:19006'], // Adjust to your frontend's URL
    //origin: 'http://localhost:19006',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
}));
//Test Route
app.get('/', (req: Request, res: Response) => {
   res.send('Server is running!');
});
app.use('/uploads', express.static('uploads'));
// Users Route
app.use(
  session({
    secret: 'your-secret-key', // Use a strong secret
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // MySQL session store
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side access
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'lax', // Lax or strict based on CSRF protection needs
    },
  })
);
//regiter verification
app.post('/register', async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      emergencyContact,
      country,
      countryEmergencyNumber,
      mainDoctor,
      bloodType,
      birthdate,
      gender,
    } = req.body;
  
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phoneNumber || !emergencyContact) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }
  
    try {
      // Check if the email already exists
      const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
    interface EmailCheckResult extends RowDataPacket {
        id: number;
        email: string;
    }

    interface NewUser {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        phone_number: string;
        emergency_contact: string;
        country: string;
        country_emergency_num: string;
        main_doctor: string;
        blood_type: string;
        birthdate: string;
        gender: string;
    }

    db.query(emailCheckQuery, [email], async (err: QueryError, results: EmailCheckResult[]) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const sql =
            'INSERT INTO users (first_name, last_name, email, password, phone_number, emergency_contact, country, country_emergency_num, main_doctor, blood_type, birthdate, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(
            sql,
            [
                firstName,
                lastName,
                email,
                hashedPassword,
                phoneNumber,
                emergencyContact,
                country,
                countryEmergencyNumber,
                mainDoctor,
                bloodType,
                birthdate,
                gender,
            ],
            (err: QueryError) => {
                if (err) {
                    console.error('User registration failed:', err.message);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    });
    } catch (error) {
      console.error('Server error:', (error as Error).message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
//login verification, verfy credentials
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  interface LoginResult extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }

  db.query(sql, [email], async (err: QueryError, results: LoginResult[]) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Save user info in session
    (req.session as CustomSessionData).user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    };


    // Explicitly save the session
    req.session.save((err: Error) => {
      if (err) {
        console.error('Session save error:', err.message);
        return res.status(500).json({ message: 'Session error' });
      }
      console.log('Session saved:', req.session);
      res.status(200).json({ message: 'Login successful', user: (req.session as CustomSessionData).user });
    });
  });
});


  
  const authenticateSession = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if a session exists and has a user object
    if (!(req.session as CustomSessionData).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next(); // Continue to the next middleware or route handler
  };
  
  
  
  
// Example of a protected route
app.get('/protected', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: 'This is a protected route', user: (req.session as CustomSessionData).user });
  });
  
  app.get('/trends', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
    const userId = (req.session as CustomSessionData).user?.id;
  
    const sql = 'SELECT * FROM trends WHERE user_id = ?';
    db.query(sql, [userId], (err: QueryError, results: RowDataPacket[]) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(results);
    });
  });
  
  app.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err.message);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Logout successful' });
    });
  });
  
  const ensureAuthenticated = (req: SessionRequest, res: Response, next: NextFunction) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  interface ProtectedRequest extends SessionRequest {
    session: Session & CustomSessionData;
  }

  interface ProtectedResponse extends Response {
    json: (body: { user: CustomSessionData['user'] }) => this;
  }

  app.get('/protected', ensureAuthenticated, (req: ProtectedRequest, res: ProtectedResponse) => {
    res.json({ user: req.session.user });
  });
    
 //Medical History data routes
app.post('/api/medical-history', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const { type, details } = req.body;
  const userId = (req.session as CustomSessionData).user?.id;
  console.log('User ID from session:', userId);
  if (!type || !details) {
    return res.status(400).json({ message: 'Type and details are required' });
  }

  const sql = 'INSERT INTO medical_history (user_id, type, details) VALUES (?, ?, ?)';
  db.query(sql, [userId, type, details], (err: QueryError) => {
    if (err) {
      console.error('Error inserting medical history:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'Medical history added successfully' });
  });
});

// Get All Medical History for User
app.get('/api/medical-history', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.session as CustomSessionData).user?.id;
  console.log('User ID from session:', userId);
  const sql = 'SELECT * FROM medical_history WHERE user_id = ? ORDER BY uploaded_date DESC';
  db.query(sql, [userId], (err: QueryError, results: RowDataPacket[]) => {
    if (err) {
      console.error('Error fetching medical history:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});


app.get('/api/test-types', (req: Request, res: Response) => {
  const testTypes = ['Blood Work', 'Urine', 'Allergy', 'Other'];
  res.json(testTypes);
});
app.get('/api/test-names', (req: Request, res: Response) => {
  const { type } = req.query;
  console.log('Test Type Received:', type); // Add this log
  if (!type) {
    return res.status(400).json({ message: 'Test type is required' });
  }

  const sql = 'SELECT id, name, unit, min_value, max_value FROM test_names WHERE test_type = ?';
  db.query(sql, [type], (err: QueryError, results: RowDataPacket[]) => {
    if (err) {
      console.error('Error fetching test names:', err.message);
      return res.status(500).json({ message: 'Failed to fetch test names' });
    }
    res.json(results);
  });
});


app.post('/api/lab-tests', (req: Request, res: Response) => {
  const { test_name_id, value, date, notes } = req.body;
  
  // Check if required fields are provided
  if (!test_name_id || !value || !date) {
    return res.status(400).json({ message: 'Test name, value, and date are required' });
  }

  const sql = `
    INSERT INTO lab_tests (test_name_id, user_id, value, date, notes, status)
    VALUES (?, ?, ?, ?, ?, 'Completed')
  `;
  const userId = (req.session as CustomSessionData).user?.id;
  
  console.log('User ID from session:', userId);
  db.query(sql, [test_name_id, userId, value, date, notes || null], (err: QueryError) => {
    if (err) {
      console.error('Error inserting test result:', err.message);
      return res.status(500).json({ message: 'Failed to add test result' });
    }
    res.status(201).json({ message: 'Test result added successfully' });
  });
});
interface TestEvolutionResult extends RowDataPacket {
  date: string;
  value: number;
  test_name: string;
}

app.get('/api/test-evolution', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.session as CustomSessionData).user?.id;
  console.log('User ID from session:', userId);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = `
    SELECT
    lt.date,
    lt.value,
    tn.name
FROM
    lab_tests lt
JOIN
    test_names tn ON lt.test_name_id = tn.id
WHERE
    lt.user_id = ? AND tn.name IN ('Glucose', 'Lactate Dehydrogenase (LDH)', 'High-Density Lipoprotein (HDL)', 'Triglycerides', 'Thyroid Stimulating Hormone (TSH)', 'Free T4 (Thyroxine)', 'Free T3 (Triiodothyronine)', 'Vitamin D (25-Hydroxy)')
ORDER BY
    lt.date ASC;
  `;

  db.query(sql, [userId], (err: QueryError, results: TestEvolutionResult[]) => {
    if (err) {
      console.error('Error fetching test evolution:', err.message);
      return res.status(500).json({ message: 'Failed to fetch test evolution' });
    }

    res.json(results);
  });
});
interface SymptomRequest extends Request {
  body: {
    userId: number;
    symptomName: string;
  };
}

interface SymptomResult extends RowDataPacket {
  id: number;
  count: number;
}
interface GetSymptomsRequest extends Request {
  query: {
    userId: string;
  };
}

interface Symptom {
  symptom_name: string;
  count: number;
  last_logged: string;
}

const util = require('util');

app.get('/api/symptoms', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.session as CustomSessionData).user?.id;
  console.log('User ID from session:', userId);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = 'SELECT symptom_name AS name, count, logged_date AS last_logged FROM symptoms WHERE user_id = ? ORDER BY logged_date DESC';
  db.query(sql, [userId], (err: QueryError, results: Symptom[]) => {
    if (err) {
      console.error('Error fetching symptoms:', err.message);
      return res.status(500).json({ message: 'Failed to fetch symptoms' });
    }
    console.log('Fetched symptoms:', results);
    res.json(results);
  });
});
app.post('/api/symptoms', authenticateSession, async (req: AuthenticatedRequest, res: Response) => {
  const { symptomName } = req.body;
  const userId = (req.session as CustomSessionData).user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!symptomName) {
    return res.status(400).json({ message: 'Symptom name is required.' });
  }

  try {
    const existingSymptomQuery = `
      SELECT id, count FROM symptoms WHERE user_id = ? AND symptom_name = ?
    `;
    db.query(existingSymptomQuery, [userId, symptomName], (err: QueryError, results: SymptomResult[]) => {
      if (err) {
      console.error('Error checking existing symptom:', err.message);
      return res.status(500).json({ message: 'Server error.' });
      }

      if (results.length > 0) {
      const updateSymptomQuery = `
        UPDATE symptoms SET count = count + 1, logged_date = NOW() WHERE id = ?
      `;
      db.query(updateSymptomQuery, [results[0].id], (updateErr: QueryError) => {
        if (updateErr) {
        console.error('Error updating symptom:', updateErr.message);
        return res.status(500).json({ message: 'Failed to update symptom.' });
        }
        return res.status(200).json({ message: 'Symptom count updated successfully.' });
      });
      } else {
      const insertSymptomQuery = `
        INSERT INTO symptoms (user_id, symptom_name, count, logged_date)
        VALUES (?, ?, 1, NOW())
      `;
      db.query(insertSymptomQuery, [userId, symptomName], (insertErr: QueryError) => {
        if (insertErr) {
        console.error('Error inserting symptom:', insertErr.message);
        return res.status(500).json({ message: 'Failed to log symptom.' });
        }
        return res.status(200).json({ message: 'Symptom logged successfully.' });
      });
      }
    });
  } catch (error) {
    console.error('Error logging symptom:', (error as Error).message);
    res.status(500).json({ message: 'Server error.' });
  }
});
//appointments
// Add Appointment
app.post('/api/appointments', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const { appointment_date, time, place, type, doctor, specialty } = req.body;
  const userId = (req.session as CustomSessionData).user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!appointment_date || !time || !place || !type || !doctor || !specialty) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Convert ISO 8601 to MySQL DATETIME format
    const formattedDate = new Date(appointment_date).toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      INSERT INTO appointments (user_id, appointment_date, time, place, type, doctor, specialty)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [userId, formattedDate, time, place, type, doctor, specialty],
      (err: QueryError) => {
        if (err) {
          console.error('Error inserting appointment:', err.message);
          return res.status(500).json({ message: 'Failed to add appointment.' });
        }
        res.status(201).json({ message: 'Appointment added successfully.' });
      }
    );
  } catch (error) {
    console.error('Error:', (error as Error).message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get Appointments
app.get('/api/appointments', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.session as CustomSessionData).user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = `
    SELECT id, DATE(appointment_date) AS date, time, place, type, doctor, specialty
    FROM appointments
    WHERE user_id = ?
    ORDER BY appointment_date DESC
  `;

  db.query(sql, [userId], (err: QueryError, results: RowDataPacket[]) => {
    if (err) {
      console.error('Error fetching appointments:', err.message);
      return res.status(500).json({ message: 'Server error.' });
    }
    res.json(results);
  });
});
app.get('/api/emergency-contact', authenticateSession, (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.session as CustomSessionData).user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const query = 'SELECT emergency_contact FROM users WHERE id = ?';
  db.query(query, [userId], (err: QueryError, results: { emergency_contact: string }[]) => {
    if (err) {
      console.error('Error fetching emergency contact:', err.message);
      return res.status(500).json({ message: 'Failed to fetch emergency contact' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    res.status(200).json({ emergencyContact: results[0].emergency_contact });
  });
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.1.128:${PORT}`);
});