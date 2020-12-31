import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface AlertQuery extends DataQuery {
  active?: boolean;
  silenced?: boolean;
  inhibited?: boolean;
  unprocessed?: boolean;
  receiver?: string;
  filter?: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface AlertDataSourceOptions extends DataSourceJsonData {
  url: string;
}
