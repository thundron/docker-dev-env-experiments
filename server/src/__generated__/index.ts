/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: aJXvtmVxq6M61qovmxf1JdCPuJb9VSRx0y7YL0BlrsfEtio1l4GAzrWk+zHkcoVmbXqvia462uI+zvrM7QAP+A==
 */

/* eslint-disable */
// tslint:disable

import SpeedtestData, {SpeedtestData_InsertParameters} from './speedtest_data'

interface DatabaseSchema {
  speedtest_data: {record: SpeedtestData, insert: SpeedtestData_InsertParameters};
}
export default DatabaseSchema;

function serializeValue(_tableName: string, _columnName: string, value: unknown): unknown {
  return value;
}
export {serializeValue}