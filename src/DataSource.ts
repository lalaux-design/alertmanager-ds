//import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

//import { AlertQuery, MyDataSourceOptions, defaultQuery } from './types';
import { AlertQuery, AlertDataSourceOptions } from './types';

import { getBackendSrv } from '@grafana/runtime';

export class DataSource extends DataSourceApi<AlertQuery, AlertDataSourceOptions> {
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<AlertDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.jsonData.url;
  }

  isNum(val: string) {
    return !isNaN(+val);
  }
  async doRequest(query: AlertQuery, path: string) {
    if (query.filter === '') {
      delete query.filter;
    }
    const result = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: 'http://' + this.url + '/api/v2/' + path,
      params: query,
    });

    return result;
  }

  async query(options: DataQueryRequest<AlertQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map(query =>
      this.doRequest(query, 'alerts').then(response => {
        let names = new Set();
        var annotations: string[] = [];
        var labels: string[] = [];
        var allValuesNumeric = true;
        //let pos = 3;
        const frame = new MutableDataFrame({
          refId: query.refId,
          fields: [
            { name: 'Time', type: FieldType.time },
            { name: 'State', type: FieldType.string },
          ],
        });
        response.data.forEach((point: any) => {
          if (!this.isNum(point.labels['severity'])) {
            allValuesNumeric = false;
          }
          for (let l in point.labels) {
            if (l === 'severity') {
              continue;
            }
            if (!names.has(l)) {
              labels.push(l);
              names.add(l);
            }
          }
          for (let l in point.annotations) {
            if (!names.has(l)) {
              annotations.push(l);
              names.add(l);
            }
          }
        });
        if (allValuesNumeric) {
          frame.addField({ name: 'Value', type: FieldType.number });
        } else {
          frame.addField({ name: 'Value', type: FieldType.string });
        }
        for (let l in labels) {
          frame.addField({ name: labels[l], type: FieldType.string });
        }
        for (let l in annotations) {
          frame.addField({ name: annotations[l], type: FieldType.string });
        }

        response.data.forEach((point: any) => {
          //Number(point.labels['severity'])
          let row: any[] = [point.startsAt, point.status['state'], point.labels['severity']];
          for (let l in labels) {
            row.push(point.labels[labels[l]]);
          }
          for (let l in annotations) {
            row.push(point.annotations[annotations[l]]);
          }
          frame.appendRow(row);
        });

        return frame;
      })
    );

    return Promise.all(promises).then(data => ({ data }));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return this.doRequest({} as AlertQuery, 'status').then(response => {
      console.log(response);
      return {
        status: 'success',
        message: 'Success',
      };
    });
  }
}
