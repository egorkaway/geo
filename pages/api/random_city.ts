import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

type RowData = {
  City: string;
  Users: string;
  Latitude: number;
  Longitude: number;
  Visits: number;
};

type ResponseData = {
  cities: RowData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const db = new sqlite3.Database('./sqlite_cities.db', sqlite3.OPEN_READONLY);

  try {
    const limit = Array.isArray(req.query.x) ? req.query.x[0] : req.query.x;

    db.all(`SELECT city as City, users as Users, latitude as Latitude, longitude as Longitude, visits as Visits FROM cities_with_users ORDER BY RANDOM() LIMIT ${limit}`, [], (err, rows: RowData[]) => {
      if (err) {
        console.error('SQLite error:', err);
        return res.status(500).json({ cities: [] });
      }

      const cities = rows.map(row => ({
        City: row.City,
        Users: row.Users,
        Latitude: row.Latitude,
        Longitude: row.Longitude,
        Visits: row.Visits
      }));

      return res.status(200).json({ cities });
    });
  } catch (err) {
    console.error('SQLite error:', err);
    return res.status(500).json({ cities: [] });
  } finally {
    db.close();
  }
}