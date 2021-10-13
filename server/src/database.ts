import Pool, { sql } from '@databases/pg';
import tables from '@databases/pg-typed';
import { request } from 'https';
import DatabaseSchema, {serializeValue} from './__generated__';
import { SpeedtestData_InsertParameters } from './__generated__/speedtest_data';

export { sql };

const pool = Pool({
    poolSize: 20,
    connectionString: 'postgres://speedtest:speedtestqq@postgres:5432/db',
    idleTimeoutMilliseconds: 30000
});
export default pool;

const { speedtest_data } = tables<DatabaseSchema>({
  serializeValue,
});
export { speedtest_data };

export async function getAll() {
  try {
    const rows = await pool.query(
      sql`
        SELECT data
        FROM speedtest_data
      `
    );
    return rows;
  } catch (error: any) {
    throw error;
  }
}

export async function get(id: string) {
  try {
    const [row] = await pool.query(
      sql`
        SELECT data
        FROM speedtest_data
        WHERE id=${id}
      `
    );
    return row?.data;
  } catch (error: any) {
    throw error;
  }
}

export async function set(id: string, value: string) {
  try {
    await pool.query(sql`
      INSERT INTO speedtest_data (id, data)
      VALUES (${id}, ${value})
    `);
  } catch (error: any) {
    throw error;
  }
}

export async function insertURL({ method, url, data }: SpeedtestData_InsertParameters) {
  await speedtest_data(pool).insert({
    method,
    url,
    data,
  });
}

  export async function updateURL(url: string, {
    method,
    data,
  }: SpeedtestData_InsertParameters) {
  await speedtest_data(pool).update({ url }, {
    method,
    url,
    data,
  });
}

export async function deleteURL(url: string) {
  await speedtest_data(pool).delete({ url });
}

export async function getURL(url: string) {
  return await speedtest_data(pool).findOne({ url });
}

async function run() {
  const options = {
    protocol: 'https',
    host: 'jsonplaceholder.typicode.com',
    method: 'GET',
    path: '/users'
  };
  request(options, (res) => {
    let data: Buffer[] = [];
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.statusCode);
    console.log('Date in Response header:', headerDate);

    res.on('data', (chunk: Buffer) => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Response ended: ');
      const users = JSON.parse(Buffer.concat(data).toString());

      for(const user of users) {
        console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      }
    });
  }).on('error', (err) => {
    console.log('Error: ', err.message);
  });
}
