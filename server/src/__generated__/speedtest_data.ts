/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: qNj1EdRyESoV2tynBs/oW+bWZQ1OCPo18KmNVUkUk07aQkMgEUyNMdIaYw8b6qxLeW8HGvlHaBAoqjYxRlvemA==
 */

/* eslint-disable */
// tslint:disable

interface SpeedtestData {
  data: string
  /**
   * @default nextval('speedtest_data_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'speedtest_data_id'}
  method: string
  url: string
}
export default SpeedtestData;

interface SpeedtestData_InsertParameters {
  data: string
  /**
   * @default nextval('speedtest_data_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'speedtest_data_id'}
  method: string
  url: string
}
export type {SpeedtestData_InsertParameters}
