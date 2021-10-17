import Pool, { sql } from '@databases/pg';
import tables from '@databases/pg-typed';
import DatabaseSchema, {serializeValue} from './__generated__';
import { SpeedtestData_InsertParameters } from './__generated__/speedtest_data';

export { sql };

const pool = Pool({
    poolSize: 20,
    connectionString: process.env.POSTGRES_DATABASE_URL,
    idleTimeoutMilliseconds: 30000
});
export default pool;

const { speedtest_data } = tables<DatabaseSchema>({
  serializeValue,
});
export { speedtest_data };

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

export async function getURLs() {
  return await speedtest_data(pool).find().all();
}
